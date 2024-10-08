import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clipboard, DollarSign, Truck, CheckCircle } from 'lucide-react'

const CaseManagement: React.FC = () => {
  const { caseType } = useParams<{ caseType: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { id: 1, name: 'Supervision', icon: Clipboard },
    { id: 2, name: 'Évaluation des coûts', icon: DollarSign },
    { id: 3, name: 'Logistique', icon: Truck },
    { id: 4, name: 'Résolution', icon: CheckCircle },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Cas résolu, retour à la sélection des cas
      navigate('/case-selection')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion du Cas {caseType}</h1>
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className={`flex flex-col items-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
              <step.icon size={32} className="mb-2" />
              <span className="text-sm">{step.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">{steps[currentStep - 1].name}</h2>
        {/* Ici, vous pouvez ajouter le contenu spécifique à chaque étape */}
        <p className="text-gray-600 mb-4">
          Contenu spécifique à l'étape {steps[currentStep - 1].name} pour le cas de type {caseType}.
        </p>
        <button
          onClick={handleNextStep}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {currentStep < steps.length ? 'Étape suivante' : 'Terminer le cas'}
        </button>
      </div>
    </div>
  )
}

export default CaseManagement