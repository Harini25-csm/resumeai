'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'

// Register fonts
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    lineHeight: 1.4,
    color: '#333'
  },
  header: {
    marginBottom: 20
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  contact: {
    fontSize: 10,
    color: '#666',
    marginBottom: 16
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1px solid #000',
    paddingBottom: 4
  },
  experienceItem: {
    marginBottom: 12
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  company: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#555'
  },
  dates: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 12
  },
  skillsList: {
    fontSize: 10,
    marginBottom: 2
  }
})

// Modern Template - Clean Two-Column
const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>YOUR NAME</Text>
        <Text style={styles.contact}>your.email@example.com | (555) 123-4567 | linkedin.com/in/yourprofile</Text>
      </View>

      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
          <Text>{data.summary}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
        {data.experience.map((exp: any, index: number) => (
          <View key={index} style={styles.experienceItem}>
            <Text style={styles.jobTitle}>{exp.title}</Text>
            <Text style={styles.company}>{exp.company}</Text>
            <Text style={styles.dates}>{exp.dates}</Text>
            {exp.bullets.map((bullet: any, bulletIndex: number) => (
              bullet && <Text key={bulletIndex} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SKILLS</Text>
        {data.skills.map((skill: any, index: number) => (
          skill && <Text key={index} style={styles.skillsList}>• {skill}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {data.education.map((edu: any, index: number) => (
          <View key={index}>
            <Text style={styles.jobTitle}>{edu.degree}</Text>
            <Text style={styles.company}>{edu.school}</Text>
            <Text style={styles.dates}>{edu.dates}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

// Classic Template - Traditional Single-Column
const ClassicTemplate = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>YOUR NAME</Text>
        <Text style={styles.contact}>123 Main Street, City, State 12345 | (555) 123-4567 | your.email@example.com</Text>
      </View>

      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUMMARY</Text>
          <Text>{data.summary}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
        {data.experience.map((exp: any, index: number) => (
          <View key={index} style={styles.experienceItem}>
            <Text style={styles.jobTitle}>{exp.title} – {exp.company}</Text>
            <Text style={styles.dates}>{exp.dates}</Text>
            {exp.bullets.map((bullet: any, bulletIndex: number) => (
              bullet && <Text key={bulletIndex} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {data.education.map((edu: any, index: number) => (
          <View key={index}>
            <Text style={styles.jobTitle}>{edu.degree}</Text>
            <Text style={styles.company}>{edu.school}, {edu.dates}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SKILLS & EXPERTISE</Text>
        <Text>{data.skills.filter((skill: any) => skill).join(', ')}</Text>
      </View>
    </Page>
  </Document>
)

// Minimal Template - Bold Typography
const MinimalTemplate = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="LETTER" style={{ ...styles.page, padding: 60 }}>
      <View style={styles.header}>
        <Text style={{ ...styles.name, fontSize: 32, marginBottom: 8 }}>YOUR NAME</Text>
        <Text style={{ ...styles.contact, fontSize: 12, marginBottom: 24 }}>
          your.email@example.com • (555) 123-4567 • linkedin.com/in/yourprofile
        </Text>
      </View>

      {data.summary && (
        <View style={{ ...styles.section, marginBottom: 24 }}>
          <Text style={{ ...styles.sectionTitle, fontSize: 16, border: 'none', borderBottom: '2px solid #000' }}>
            ABOUT
          </Text>
          <Text style={{ fontSize: 12, lineHeight: 1.6 }}>{data.summary}</Text>
        </View>
      )}

      <View style={{ ...styles.section, marginBottom: 24 }}>
        <Text style={{ ...styles.sectionTitle, fontSize: 16, border: 'none', borderBottom: '2px solid #000' }}>
          EXPERIENCE
        </Text>
        {data.experience.map((exp: any, index: number) => (
          <View key={index} style={{ ...styles.experienceItem, marginBottom: 16 }}>
            <Text style={{ ...styles.jobTitle, fontSize: 14 }}>{exp.title}</Text>
            <Text style={{ ...styles.company, fontSize: 12, fontWeight: 'bold' }}>{exp.company}</Text>
            <Text style={{ ...styles.dates, fontSize: 11, fontStyle: 'italic' }}>{exp.dates}</Text>
            {exp.bullets.map((bullet: any, bulletIndex: number) => (
              bullet && <Text key={bulletIndex} style={{ ...styles.bullet, fontSize: 11 }}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={{ ...styles.section, marginBottom: 24 }}>
        <Text style={{ ...styles.sectionTitle, fontSize: 16, border: 'none', borderBottom: '2px solid #000' }}>
          EDUCATION
        </Text>
        {data.education.map((edu: any, index: number) => (
          <View key={index}>
            <Text style={{ ...styles.jobTitle, fontSize: 14 }}>{edu.degree}</Text>
            <Text style={{ ...styles.company, fontSize: 12, fontWeight: 'bold' }}>{edu.school}</Text>
            <Text style={{ ...styles.dates, fontSize: 11, fontStyle: 'italic' }}>{edu.dates}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={{ ...styles.sectionTitle, fontSize: 16, border: 'none', borderBottom: '2px solid #000' }}>
          SKILLS
        </Text>
        <Text style={{ fontSize: 12 }}>{data.skills.filter((skill: any) => skill).join(' • ')}</Text>
      </View>
    </Page>
  </Document>
)

interface ResumePreviewProps {
  data: ResumeData
  template: 'modern' | 'classic' | 'minimal'
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate
  }

  const TemplateComponent = templates[template]
  
  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg" style={{ width: '612px', height: '792px' }}>
        <TemplateComponent data={data} />
      </div>
    </div>
  )
}
