export default function MinimalTemplate({ data, isEditing, onFieldClick }: any) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '50px 40px', minHeight: '297mm', backgroundColor: 'white' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '300', margin: '0 0 16px', color: '#111827', letterSpacing: '1px' }}>
          {data.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div style={{ width: '60px', height: '1px', backgroundColor: '#E5E7EB', margin: '0 0 20px' }}></div>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 8px', fontWeight: '300' }}>
          {data.personalInfo?.jobTitle || 'Your Job Title'}
        </p>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).join(' • ')}
        </p>
      </div>

      {data.summary && (
        <div style={{ marginBottom: '32px' }}>
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.8', fontSize: '14px' }}>
            {data.summary}
          </p>
        </div>
      )}

      {(data.experience || []).length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Experience
          </h2>
          {(data.experience || []).map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontWeight: '500', margin: 0, color: '#111827', fontSize: '14px' }}>{exp.jobTitle}</p>
                <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '13px' }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              {(exp.bullets || []).filter((b: string) => b).map((b: string, j: number) => (
                <p key={j} style={{ margin: '4px 0 0 0', color: '#374151', fontSize: '13px', lineHeight: '1.6' }}>• {b}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {((data.skills?.technical || []).length > 0 || (data.skills?.soft || []).length > 0) && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Skills
          </h2>
          <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
            {[...(data.skills?.technical || []), ...(data.skills?.soft || [])].join(' • ')}
          </p>
        </div>
      )}

      {(data.education || []).length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Education
          </h2>
          {(data.education || []).map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: '500', margin: '0 0 4px', color: '#111827', fontSize: '14px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
              <p style={{ margin: '0 0 4px', color: '#6B7280', fontSize: '13px' }}>{edu.institution}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{edu.startDate} – {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
