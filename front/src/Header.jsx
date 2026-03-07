import Logo from '../public/logo.svg'

function Header() {
    return (
        <header>
            <img src={Logo} alt="logo SportSee" />
            <ul>
                <li>Accueil</li>
                <li>Profil</li>
                <li>Réglages</li>
                <li>Communauté</li>
            </ul>
        </header>
    );
}

export default Header;