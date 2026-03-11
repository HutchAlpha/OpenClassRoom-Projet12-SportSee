
import Yoga from "../public/assets/yoga.svg";
import Swimming from "../public/assets/swimming.svg";
import Cycling from "../public/assets/cycling.svg";
import Bodybuilding from "../public/assets/bodybuilding.svg";
import './styles/Sidebar.scss' 


function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar__item">
                <img src={Yoga} alt="Yoga" />
            </div>
            <div className="sidebar__item">
                <img src={Swimming} alt="Natation" />
            </div>
            <div className="sidebar__item">
                <img src={Cycling} alt="Cyclisme" />
            </div>
            <div className="sidebar__item">
                <img src={Bodybuilding} alt="Musculation" />
            </div>
     
            <div className="sidebar__copyright">
                <p>Copyright, SportSee 2026</p>
            </div>

        </div>
    );
}

export default Sidebar;