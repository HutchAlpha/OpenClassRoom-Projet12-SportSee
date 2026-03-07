import Logo from '../public/logo.svg'
import './styles/Header.scss'

function Header() {
    return (
        <header className="header">
            <div className="header__logo">
                <img src={Logo} alt="logo SportSee" />
            </div>

            <nav className="header__nav">
                <ul className="header__list">
                <li className="header__item">Accueil</li>
                <li className="header__item">Profil</li>
                <li className="header__item">Réglage</li>
                <li className="header__item">Communauté</li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;