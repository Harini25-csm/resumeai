export default function ModernTemplate({ data, isEditing, onFieldClick }: any) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', minHeight: '297mm', backgroundColor: 'white' }}>
      <div style={{ backgroundColor: '#2563EB', padding: '32px', margin: '-40px -40px 32px', color: 'white' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>{data.personalInfo?.fullName || 'Your Full Name'}</h1>
        <p style={{ fontSize: '18px', margin: '0 0 12px', opacity: 0.9 }}>{data.personalInfo?.jobTitle || 'Your Job Title'}</p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', opacity: 0.85, flexWrap: 'wrap' }}>
          {data.personalInfo?.email && <span>✉ {data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>📱 {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>📍 {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
        </div>
      </div>
      {data.summary && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2563EB', paddingBottom: '6px', marginBottom: '12px' }}>Professional Summary</h2>
          <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>{data.summary}</p>
        </div>
      )}
      {(data.experience || []).length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2563EB', paddingBottom: '6px', marginBottom: '12px' }}>Experience</h2>
          {(data.experience || []).map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0', fontSize: '15px' }}>{exp.jobTitle}</p>
                  <p style={{ color: '#2563EB', margin: '2px 0', fontStyle: 'italic' }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                </div>
                <p style={{ color: '#6B7280', fontSize: '13px', whiteSpace: 'nowrap' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              {(exp.bullets || []).filter((b: string) => b).map((b: string, j: number) => (
                <p key={j} style={{ margin: '4px 0 0 16px', color: '#374151' }}>• {b}</p>
              ))}
            </div>
          ))}
        </div>
      )}
      {((data.skills?.technical || []).length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2563EB', paddingBottom: '6px', marginBottom: '12px' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(data.skills?.technical || []).map((s: string, i: number) => (
              <span key={i} style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', border: '1px solid #BFDBFE' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {(data.education || []).length > 0 && (
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2563EB', paddingBottom: '6px', marginBottom: '12px' }}>Education</h2>
          {(data.education || []).map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
              <p style={{ color: '#6B7280', margin: '2px 0', fontStyle: 'italic' }}>{edu.institution}</p>
              <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>{edu.startDate} – {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
