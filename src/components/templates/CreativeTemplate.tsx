export default function CreativeTemplate({ data, isEditing, onFieldClick }: any) {
  const color = '#8B5CF6'; // Purple color for creative template
  
  return (
    <div style={{ display: 'flex', minHeight: '297mm', backgroundColor: 'white' }}>
      {/* Purple Sidebar - 30% */}
      <div style={{ 
        width: '30%', 
        backgroundColor: color, 
        padding: '30px 20px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          backgroundColor: 'white', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: color,
          marginBottom: '16px'
        }}>
          {(data.personalInfo?.fullName || 'Your Name').charAt(0).toUpperCase()}
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px', textAlign: 'center' }}>
          {data.personalInfo?.fullName || 'Your Name'}
        </h3>
        <p style={{ fontSize: '12px', margin: 0, textAlign: 'center', opacity: 0.9 }}>
          {data.personalInfo?.jobTitle || 'Your Job Title'}
        </p>
        
        <div style={{ marginTop: '20px', width: '100%' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', opacity: 0.8 }}>CONTACT</div>
          {data.personalInfo?.email && <div style={{ fontSize: '11px', marginBottom: '4px' }}>✉ {data.personalInfo.email}</div>}
          {data.personalInfo?.phone && <div style={{ fontSize: '11px', marginBottom: '4px' }}>📱 {data.personalInfo.phone}</div>}
          {data.personalInfo?.location && <div style={{ fontSize: '11px', marginBottom: '4px' }}>📍 {data.personalInfo.location}</div>}
          {data.personalInfo?.linkedin && <div style={{ fontSize: '11px', marginBottom: '4px' }}>🔗 {data.personalInfo.linkedin}</div>}
        </div>
        
        {((data.skills?.technical || []).length > 0 || (data.skills?.soft || []).length > 0) && (
          <div style={{ marginTop: '20px', width: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', opacity: 0.8 }}>SKILLS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[...(data.skills?.technical || []), ...(data.skills?.soft || [])].map((skill: string, i: number) => (
                <span key={i} style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Area - 70% */}
      <div style={{ flex: 1, padding: '30px' }}>
        {data.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: color, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              About Me
            </h2>
            <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>{data.summary}</p>
          </div>
        )}

        {(data.experience || []).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: color, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Experience
            </h2>
            {(data.experience || []).map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: '20px', paddingLeft: '16px', borderLeft: `3px solid ${color}40` }}>
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: 'bold', margin: 0, color: '#111827', fontSize: '14px' }}>{exp.jobTitle}</p>
                  <p style={{ margin: '4px 0 0', color: '#6B7280', fontStyle: 'italic' }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                {(exp.bullets || []).filter((b: string) => b).map((b: string, j: number) => (
                  <p key={j} style={{ margin: '4px 0 0 16px', color: '#374151' }}>• {b}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        {((data.skills?.technical || []).length > 0 || (data.skills?.soft || []).length > 0) && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: color, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[...(data.skills?.technical || []), ...(data.skills?.soft || [])].map((skill: string, i: number) => (
                <span key={i} style={{ 
                  backgroundColor: `${color}20`, 
                  color: color, 
                  padding: '6px 12px', 
                  borderRadius: '16px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  border: `1px solid ${color}40`
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(data.education || []).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: color, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
    </div>
  )
}
