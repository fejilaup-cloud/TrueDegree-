import { SorobanRpc, Contract, Address } from '@stellar/js-sdk';

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';
const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export const sorobanClient = new SorobanRpc.Server(rpcUrl);

export async function getTranscript(studentAddress: string) {
  try {
    const result = await sorobanClient.getContractData(
      contractId,
      SorobanRpc.xdr.ScVal.scValTypeContractData(),
      {
        discriminant: SorobanRpc.xdr.ContractDataType.contractDataTypeInstance(),
      }
    );
    return result;
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    throw error;
  }
}

export async function verifyCredential(studentAddress: string, courseId: string) {
  try {
    const result = await sorobanClient.simulateTransaction(
      new SorobanRpc.TransactionBuilder(
        new Address(studentAddress),
        1,
        new SorobanRpc.Keypair.random()
      ).build()
    );
    return result;
  } catch (error) {
    console.error('Failed to verify credential:', error);
    throw error;
  }
}
