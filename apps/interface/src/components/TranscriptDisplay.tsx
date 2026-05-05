'use client';

interface Credential {
  course_id: string;
  grade: string;
  timestamp: number;
}

interface TranscriptDisplayProps {
  transcript: {
    credentials: Credential[];
    student: string;
  };
}

export default function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  if (!transcript || !transcript.credentials || transcript.credentials.length === 0) {
    return <div className="mt-8 p-4 bg-yellow-100 rounded">No credentials found</div>;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Transcript</h2>
      <p className="text-sm text-gray-600 mb-4">Student: {transcript.student}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Course ID</th>
            <th className="border p-2 text-left">Grade</th>
            <th className="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {transcript.credentials.map((cred) => (
            <tr key={`${cred.course_id}-${cred.timestamp}`} className="hover:bg-gray-50">
              <td className="border p-2">{cred.course_id}</td>
              <td className="border p-2">{cred.grade}</td>
              <td className="border p-2">{new Date(cred.timestamp * 1000).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
