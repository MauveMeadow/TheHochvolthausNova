import ConceptStory from './ConceptStory'

function TheConcept({ onShowHistory }) {
  return (
    <div className="container">
      <div className="max-w-6xl mx-auto">
        <ConceptStory onShowHistory={onShowHistory} />
      </div>
    </div>
  )
}

export default TheConcept
