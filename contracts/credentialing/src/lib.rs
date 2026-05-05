#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, String, Vec};

#[derive(Clone)]
#[contracttype]
pub struct Credential {
    pub student: Address,
    pub course_id: String,
    pub grade: String,
    pub timestamp: u64,
}

#[contract]
pub struct CredentialingContract;

#[contractimpl]
impl CredentialingContract {
    pub fn initialize(env: Env, university: Address, admin_key: Address) {
        let storage = env.storage().persistent();
        storage.set(&String::from_slice(&env, "university"), &university);
        storage.set(&String::from_slice(&env, "admin"), &admin_key);
    }

    pub fn mint_credential(
        env: Env,
        student: Address,
        course_id: String,
        grade: String,
        timestamp: u64,
    ) {
        let storage = env.storage().persistent();
        let admin: Address = storage.get(&String::from_slice(&env, "admin")).unwrap().unwrap();
        admin.require_auth();

        let credential = Credential {
            student: student.clone(),
            course_id: course_id.clone(),
            grade,
            timestamp,
        };

        let mut transcripts: Map<Address, Vec<Credential>> =
            storage.get(&String::from_slice(&env, "transcripts")).unwrap_or(Map::new(&env));

        let mut student_creds = transcripts.get(student.clone()).unwrap_or(Vec::new(&env));
        student_creds.push_back(credential);
        transcripts.set(student, student_creds);

        storage.set(&String::from_slice(&env, "transcripts"), &transcripts);
    }

    pub fn verify_credential(env: Env, student: Address, course_id: String) -> bool {
        let storage = env.storage().persistent();
        let transcripts: Map<Address, Vec<Credential>> =
            storage.get(&String::from_slice(&env, "transcripts")).unwrap_or(Map::new(&env));

        if let Some(creds) = transcripts.get(student) {
            for i in 0..creds.len() {
                if let Some(cred) = creds.get(i) {
                    if cred.course_id == course_id {
                        return true;
                    }
                }
            }
        }
        false
    }

    pub fn get_transcript(env: Env, student: Address) -> Vec<Credential> {
        let storage = env.storage().persistent();
        let transcripts: Map<Address, Vec<Credential>> =
            storage.get(&String::from_slice(&env, "transcripts")).unwrap_or(Map::new(&env));

        transcripts.get(student).unwrap_or(Vec::new(&env))
    }

    pub fn revoke_credential(env: Env, student: Address, course_id: String) {
        let storage = env.storage().persistent();
        let admin: Address = storage.get(&String::from_slice(&env, "admin")).unwrap().unwrap();
        admin.require_auth();

        let mut transcripts: Map<Address, Vec<Credential>> =
            storage.get(&String::from_slice(&env, "transcripts")).unwrap_or(Map::new(&env));

        if let Some(mut creds) = transcripts.get(student.clone()) {
            let mut new_creds = Vec::new(&env);
            for i in 0..creds.len() {
                if let Some(cred) = creds.get(i) {
                    if cred.course_id != course_id {
                        new_creds.push_back(cred);
                    }
                }
            }
            transcripts.set(student, new_creds);
            storage.set(&String::from_slice(&env, "transcripts"), &transcripts);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Env as _};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let university = Address::random(&env);
        let admin = Address::random(&env);

        CredentialingContract::initialize(env.clone(), university.clone(), admin.clone());

        let storage = env.storage().persistent();
        let stored_university: Address =
            storage.get(&String::from_slice(&env, "university")).unwrap().unwrap();
        assert_eq!(stored_university, university);
    }

    #[test]
    fn test_mint_and_verify() {
        let env = Env::default();
        let university = Address::random(&env);
        let admin = Address::random(&env);
        let student = Address::random(&env);

        CredentialingContract::initialize(env.clone(), university, admin.clone());

        admin.mock_all_auths();
        CredentialingContract::mint_credential(
            env.clone(),
            student.clone(),
            String::from_slice(&env, "CS101"),
            String::from_slice(&env, "A"),
            1000,
        );

        let verified = CredentialingContract::verify_credential(
            env.clone(),
            student.clone(),
            String::from_slice(&env, "CS101"),
        );
        assert!(verified);
    }

    #[test]
    fn test_get_transcript() {
        let env = Env::default();
        let university = Address::random(&env);
        let admin = Address::random(&env);
        let student = Address::random(&env);

        CredentialingContract::initialize(env.clone(), university, admin.clone());

        admin.mock_all_auths();
        CredentialingContract::mint_credential(
            env.clone(),
            student.clone(),
            String::from_slice(&env, "CS101"),
            String::from_slice(&env, "A"),
            1000,
        );

        let transcript = CredentialingContract::get_transcript(env.clone(), student);
        assert_eq!(transcript.len(), 1);
    }
}
