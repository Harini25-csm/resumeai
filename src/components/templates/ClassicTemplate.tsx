export default function ClassicTemplate({ data, isEditing, onFieldClick }: any) {
  return (
    <div style={{ fontFamily: 'Times New Roman, serif', padding: '40px', minHeight: '297mm', backgroundColor: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #111827' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px', color: '#111827', textTransform: 'uppercase', letterSpacing: '2px' }}>
          {data.personalInfo?.fullName || 'Your Full Name'}
        </h1>
        <p style={{ fontSize: '16px', color: '#374151', margin: '0 0 12px', fontStyle: 'italic' }}>
          {data.personalInfo?.jobTitle || 'Your Job Title'}
        </p>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).join(' • ')}
        </p>
      </div>

      {data.summary && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #111827', paddingBottom: '4px' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>{data.summary}</p>
        </div>
      )}

      {(data.experience || []).length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #111827', paddingBottom: '4px' }}>
            Professional Experience
          </h2>
          {(data.experience || []).map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontWeight: 'bold', margin: 0, color: '#111827', fontSize: '14px' }}>{exp.jobTitle}</p>
                <p style={{ margin: '4px 0 0', color: '#6B7280', fontStyle: 'italic' }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              {(exp.bullets || []).filter((b: string) => b).map((b: string, j: number) => (
                <p key={j} style={{ margin: '4px 0 0 16px', color: '#374151', textAlign: 'justify' }}>• {b}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {((data.skills?.technical || []).length > 0 || (data.skills?.soft || []).length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #111827', paddingBottom: '4px' }}>
            Technical Skills
          </h2>
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>
            {[...(data.skills?.technical || []), ...(data.skills?.soft || [])].join(', ')}
          </p>
        </div>
      )}

      {(data.education || []).length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #111827', paddingBottom: '4px' }}>
            Education
          </h2>
          {(data.education || []).map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px', color: '#111827', fontSize: '14px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
              <p style={{ margin: '0 0 4px', color: '#6B7280', fontStyle: 'italic' }}>{edu.institution}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{edu.startDate} – {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
