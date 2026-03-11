import './styles/Resultat.scss'
import Calorie from '../public/assets/calories.svg'
import Cycling from '../public/assets/cycling.svg'
import Carbs from '../public/assets/carbs.svg'
import Fat from '../public/assets/fat.svg'

function Resultat({ data }) {

    <div className="resultat">
        <div className="resultat__content">
            <img caloriesIcon src={Calorie} alt="Calories" />
            <div className="resultat__info">
                <p className="resultat__value">1930</p>
                <p className="resultat__label">Calories</p>
            </div>
        </div>    

        <div className="resultat__content">
            <img caloriesIcon src={Cycling} alt="proteiness" />
            <div className="resultat__info">
                <p className="resultat__value">1930</p>
                <p className="resultat__label">Calories</p>
            </div>
        </div>

        <div className="resultat__content">
            <img caloriesIcon src={Carbs} alt="Glucides" />
            <div className="resultat__info">
                <p className="resultat__value">1930</p>
                <p className="resultat__label">Calories</p>
            </div>
        </div>    

        <div className="resultat__content">
            <img caloriesIcon src={Fat} alt="Lipides" />
            <div className="resultat__info">
                <p className="resultat__value">1930</p>
                <p className="resultat__label">Calories</p>
            </div>
        </div>        
    </div>
}

export default Resultat;