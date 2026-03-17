'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume-builder'

interface ResumePDFPreviewProps {
  data: ResumeData
  template: string
  color: string
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1F2937',
    backgroundColor: '#FFFFFF'
  },
  modern: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  modernSidebar: {
    width: '35%',
    backgroundColor: '#6366F1',
    color: 'white',
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
    borderBottomRightRadius: 8
  },
  modernContent: {
    flex: 1,
    padding: 25,
    backgroundColor: 'white'
  },
  classic: {
    padding: 50,
    fontFamily: 'Helvetica',
    color: '#000000'
  },
  creative: {
    display: 'flex',
    flexDirection: 'row'
  },
  creativeSidebar: {
    width: '30%',
    backgroundColor: '#8B5CF6',
    color: 'white',
    padding: 25,
    display: 'flex',
    flexDirection: 'column'
  },
  creativeContent: {
    flex: 1,
    padding: 30,
    backgroundColor: 'white'
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#FFFFFF'
  },
  nameClassic: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000000'
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    color: '#E5E7EB'
  },
  jobTitleClassic: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B5563'
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 20,
    lineHeight: 1.4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    borderBottom: '2px solid #6366F1',
    paddingBottom: 4,
    color: '#1F2937'
  },
  sectionTitleClassic: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    borderBottom: '1px solid #000000',
    paddingBottom: 8,
    textAlign: 'center',
    color: '#000000'
  },
  experienceItem: {
    marginBottom: 16
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2
  },
  experienceCompany: {
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 2,
    color: '#6B7280'
  },
  experienceDates: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 12,
    lineHeight: 1.3
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    color: '#6366F1',
    padding: 4,
    borderRadius: 4,
    fontSize: 9
  },
  headerDivider: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 20
  }
})

const ModernTemplate = ({ data, color }: { data: ResumeData; color: string }) => (
  <View style={styles.modern}>
    <View style={[styles.modernSidebar, { backgroundColor: color }]}>
      <Text style={[styles.name, { color: '#FFFFFF' }]}>
        {data.personalInfo.fullName || 'Your Name'}
      </Text>
      <Text style={[styles.jobTitle, { color: '#E5E7EB' }]}>
        {data.personalInfo.jobTitle || 'Job Title'}
      </Text>
      
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#FFFFFF' }}>Contact</Text>
        <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
          {data.personalInfo.email || 'email@example.com'}
        </Text>
        <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
          {data.personalInfo.phone || '+1 234 567 8900'}
        </Text>
        <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
          {data.personalInfo.location || 'City, State'}
        </Text>
        {data.personalInfo.linkedin && (
          <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
            {data.personalInfo.linkedin}
          </Text>
        )}
        {data.personalInfo.portfolio && (
          <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
            {data.personalInfo.portfolio}
          </Text>
        )}
      </View>

      {data.skills.technical.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#FFFFFF' }}>
            Technical Skills
          </Text>
          {data.skills.technical.map((skill, index) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 3, color: '#FFFFFF' }}>
              • {skill}
            </Text>
          ))}
        </View>
      )}

      {data.skills.soft.length > 0 && (
        <View>
          <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#FFFFFF' }}>
            Soft Skills
          </Text>
          {data.skills.soft.map((skill, index) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 3, color: '#FFFFFF' }}>
              • {skill}
            </Text>
          ))}
        </View>
      )}
    </View>

    <View style={styles.modernContent}>
      {data.summary && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>
            Professional Summary
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
            {data.summary}
          </Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>
            Work Experience
          </Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <Text style={styles.experienceTitle}>{exp.jobTitle}</Text>
              <Text style={styles.experienceCompany}>{exp.company}</Text>
              <Text style={styles.experienceDates}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              {exp.location && (
                <Text style={styles.experienceDates}>{exp.location}</Text>
              )}
              {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
                <Text key={index} style={styles.bulletPoint}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>
            Education
          </Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.experienceItem}>
              <Text style={styles.experienceTitle}>{edu.degree}</Text>
              <Text style={styles.experienceCompany}>{edu.institution}</Text>
              <Text style={styles.experienceDates}>{edu.year}</Text>
              {edu.grade && (
                <Text style={styles.experienceDates}>Grade: {edu.grade}</Text>
              )}
              {edu.achievements && (
                <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
                  {edu.achievements}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  </View>
)

const ClassicTemplate = ({ data }: { data: ResumeData }) => (
  <View style={styles.classic}>
    <Text style={styles.nameClassic}>
      {data.personalInfo.fullName || 'Your Name'}
    </Text>
    <Text style={styles.jobTitleClassic}>
      {data.personalInfo.jobTitle || 'Job Title'}
    </Text>
    
    <View style={{ textAlign: 'center', marginBottom: 30, borderBottom: '1px solid #000000', paddingBottom: 16 }}>
      <Text style={[styles.contactInfo, { textAlign: 'center', marginBottom: 4 }]}>
        {data.personalInfo.email || 'email@example.com'}
      </Text>
      <Text style={[styles.contactInfo, { textAlign: 'center', marginBottom: 4 }]}>
        {data.personalInfo.phone || '+1 234 567 8900'}
      </Text>
      <Text style={[styles.contactInfo, { textAlign: 'center', marginBottom: 4 }]}>
        {data.personalInfo.location || 'City, State'}
      </Text>
      {data.personalInfo.linkedin && (
        <Text style={[styles.contactInfo, { textAlign: 'center' }]}>
          {data.personalInfo.linkedin}
        </Text>
      )}
      {data.personalInfo.portfolio && (
        <Text style={[styles.contactInfo, { textAlign: 'center' }]}>
          {data.personalInfo.portfolio}
        </Text>
      )}
    </View>

    {data.summary && (
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.sectionTitleClassic}>Professional Summary</Text>
        <Text style={{ fontSize: 11, lineHeight: 1.5, textAlign: 'justify' }}>
          {data.summary}
        </Text>
      </View>
    )}

    {data.experience.length > 0 && (
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.sectionTitleClassic}>Work Experience</Text>
        {data.experience.map((exp) => (
          <View key={exp.id} style={styles.experienceItem}>
            <Text style={styles.experienceTitle}>{exp.jobTitle}</Text>
            <Text style={styles.experienceCompany}>
              {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
            </Text>
            {exp.location && (
              <Text style={styles.experienceDates}>{exp.location}</Text>
            )}
            {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
              <Text key={index} style={styles.bulletPoint}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>
    )}

    {data.education.length > 0 && (
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.sectionTitleClassic}>Education</Text>
        {data.education.map((edu) => (
          <View key={edu.id} style={styles.experienceItem}>
            <Text style={styles.experienceTitle}>{edu.degree}</Text>
            <Text style={styles.experienceCompany}>
              {edu.institution}, {edu.year}
            </Text>
            {edu.grade && (
              <Text style={styles.experienceDates}>Grade: {edu.grade}</Text>
            )}
            {edu.achievements && (
              <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
                {edu.achievements}
              </Text>
            )}
          </View>
        ))}
      </View>
    )}

    {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
      <View>
        <Text style={styles.sectionTitleClassic}>Skills</Text>
        <Text style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.4 }}>
          <Text style={{ fontWeight: '600' }}>Technical:</Text> {data.skills.technical.join(', ')}
        </Text>
        <Text style={{ fontSize: 11, lineHeight: 1.4 }}>
          <Text style={{ fontWeight: '600' }}>Soft:</Text> {data.skills.soft.join(', ')}
        </Text>
      </View>
    )}
  </View>
)

const CreativeTemplate = ({ data, color }: { data: ResumeData; color: string }) => (
  <View style={styles.creative}>
    <View style={[styles.creativeSidebar, { backgroundColor: color }]}>
      <Text style={[styles.name, { color: '#FFFFFF' }]}>
        {data.personalInfo.fullName || 'Your Name'}
      </Text>
      <Text style={[styles.jobTitle, { color: '#E5E7EB' }]}>
        {data.personalInfo.jobTitle || 'Job Title'}
      </Text>
      
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#FFFFFF' }}>
          Contact
        </Text>
        <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
          {data.personalInfo.email || 'email@example.com'}
        </Text>
        <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
          {data.personalInfo.phone || '+1 234 567 8900'}
        </Text>
        <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
          {data.personalInfo.location || 'City, State'}
        </Text>
        {data.personalInfo.linkedin && (
          <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
            {data.personalInfo.linkedin}
          </Text>
        )}
        {data.personalInfo.portfolio && (
          <Text style={[styles.contactInfo, { color: '#FFFFFF' }]}>
            {data.personalInfo.portfolio}
          </Text>
        )}
      </View>

      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <View>
          <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#FFFFFF' }}>
            Skills
          </Text>
          {data.skills.technical.map((skill, index) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 3, color: '#FFFFFF' }}>
              • {skill}
            </Text>
          ))}
          {data.skills.soft.map((skill, index) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 3, color: '#FFFFFF' }}>
              • {skill}
            </Text>
          ))}
        </View>
      )}
    </View>

    <View style={styles.creativeContent}>
      {data.summary && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>
            Professional Summary
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
            {data.summary}
          </Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>
            Experience
          </Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ 
                  width: 8, 
                  height: 8, 
                  backgroundColor: color, 
                  borderRadius: '50%', 
                  marginTop: 2,
                  marginRight: 8 
                }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.experienceTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.experienceCompany}>{exp.company}</Text>
                  <Text style={styles.experienceDates}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
              </View>
              {exp.bullets.filter(b => b.trim()).map((bullet, index) => (
                <Text key={index} style={[styles.bulletPoint, { marginLeft: 20 }]}>
                  • {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { borderBottomColor: color }]}>
            Education
          </Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.experienceItem}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ 
                  width: 8, 
                  height: 8, 
                  backgroundColor: color, 
                  borderRadius: '50%', 
                  marginTop: 2,
                  marginRight: 8 
                }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.experienceTitle}>{edu.degree}</Text>
                  <Text style={styles.experienceCompany}>{edu.institution}</Text>
                  <Text style={styles.experienceDates}>{edu.year}</Text>
                </View>
              </View>
              {edu.achievements && (
                <Text style={{ fontSize: 10, lineHeight: 1.4, marginLeft: 20 }}>
                  {edu.achievements}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  </View>
)

export default function ResumePDFPreview({ data, template, color }: ResumePDFPreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} color={color} />
      case 'classic':
        return <ClassicTemplate data={data} />
      case 'creative':
        return <CreativeTemplate data={data} color={color} />
      default:
        return <ModernTemplate data={data} color={color} />
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderTemplate()}
      </Page>
    </Document>
  )
}
