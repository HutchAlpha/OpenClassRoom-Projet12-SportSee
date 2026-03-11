import './styles/Resultat.scss'

function Resultat({ data }) {
    const keyData = data?.main?.keyData

    if (!keyData) {
        return null
    }

    const cards = [
        {
            icon: '/assets/calories.svg',
            alt: 'Calories',
            value: `${keyData.calorieCount}kCal`,
            label: 'Calories'
        },
        {
            icon: '/assets/cycling.svg',
            alt: 'Proteines',
            value: `${keyData.proteinCount}g`,
            label: 'Proteines'
        },
        {
            icon: '/assets/carbs.svg',
            alt: 'Glucides',
            value: `${keyData.carbohydrateCount}g`,
            label: 'Glucides'
        },
        {
            icon: '/assets/fat.svg',
            alt: 'Lipides',
            value: `${keyData.lipidCount}g`,
            label: 'Lipides'
        }
    ]

    return (
        <div className="resultat">
            {cards.map(({ icon, alt, value, label }) => (
                <div className="resultat__content" key={label}>
                    <img src={icon} alt={alt} />
                    <div className="resultat__info">
                        <p className="resultat__value">{value}</p>
                        <p className="resultat__label">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Resultat;