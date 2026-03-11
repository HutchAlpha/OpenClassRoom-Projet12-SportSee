import Yoga from "../public/assets/yoga.svg";
import Swimming from "../public/assets/swimming.svg";
import Cycling from "../public/assets/cycling.svg";
import Bodybuilding from "../public/assets/bodybuilding.svg";
import './styles/Sidebar.scss'

function Sidebar() {
	return (
		<aside className="sidebar">
			<div className="sidebar__icons">
				<button className="sidebar__icon-btn">
					<img src={Yoga} alt="Yoga" />
				</button>
				<button className="sidebar__icon-btn">
					<img src={Swimming} alt="Natation" />
				</button>
				<button className="sidebar__icon-btn">
					<img src={Cycling} alt="Vélo" />
				</button>
				<button className="sidebar__icon-btn">
					<img src={Bodybuilding} alt="Musculation" />
				</button>
			</div>
			<div className="sidebar__copyright">
				Copyright, SportSee 2026
			</div>
		</aside>
	);
}

export default Sidebar;
