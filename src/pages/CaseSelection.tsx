import React from 'react'
import { Link } from 'react-router-dom'
import { Ambulance, Briefcase, Stethoscope } from 'lucide-react'

const CaseSelection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Sélection du cas médical</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CaseCard
          icon={<Ambulance size={48} />}
          title="Cas A"
          description="Urgences médicales nécessitant une intervention rapide"
          link="/case-management/A"
        />
        <CaseCard
          icon={<Briefcase size={48} />}
          title="Cas B"
          description="Consultations médicales programmées"
          link="/case-management/B"
        />
        <CaseCard
          icon={<Stethoscope size={48} />}
          title="Cas C"
          description="Soins à domicile et suivis post-hospitalisation"
          link="/case-management/C"
        />
      </div>
    </div>
  )
}

const CaseCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
      <p className="text-gray-600 text-center">{description}</p>
    </Link>
  )
}

export default CaseSelection