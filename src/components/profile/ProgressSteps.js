'use client';

export default function ProgressSteps({ steps = [], currentStep = 1 }) {
  const defaultSteps = [
    {
      title: 'ビジネス基礎',
      progress: [true, true, true, true, false, false, false, false],
      completed: true
    },
    {
      title: 'Web制作・プログラミング基礎',
      progress: [false, false, true, true, false, false, false, false],
      completed: false
    },
    {
      title: '問題解決・思考法基礎',
      progress: [false, false, false, false, false, true, true, false],
      completed: false
    },
    {
      title: 'コミュニケーション基礎',
      progress: [false, false, false, false, false, false, false, false],
      completed: false
    }
  ];

  const stepData = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="relative">
      {/* Step indicator */}
      <div className="absolute -top-1 -left-1 bg-gray-400 text-white px-4 py-1.5 rounded text-xs font-bold shadow-md z-10">
        Step{currentStep}
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-white/30 p-5 pt-8 shadow-xl">

        {stepData.map((step, stepIndex) => (
          <div key={stepIndex} className="mb-4 last:mb-0">
            {/* Checkbox for step */}
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 border border-black mr-3 bg-white flex items-center justify-center rounded-sm">
                {step.completed && (
                  <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-bold text-black">{step.title}</span>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 ml-6 mb-3">
              {step.progress.map((completed, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`w-2.5 h-2.5 rounded-sm ${
                    completed ? 'bg-purple-300' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Divider line */}
            {stepIndex < stepData.length - 1 && (
              <div className="border-b border-gray-300 ml-6"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}