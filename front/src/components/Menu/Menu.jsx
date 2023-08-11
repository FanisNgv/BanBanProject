import React from 'react';
import './Menu.css';
const Menu = ({header, items, active, setActive, action}) => {
    return (
        <div className={active?'menu active':'menu'} onClick={()=>setActive(false)}>
            <div className="blur"/>
            <div className="menu__content" onClick={e=>e.stopPropagation()}>
            <div className="menu__header">{header}</div>
            <ul>
                {items.map(item=>
                    <li>
                        <p onClick={item.action}>{item.value}</p>
                        {item.icon === "project" && <span className="material-icons">folder</span>}
                        {item.icon === "persons" && <span className="material-symbols-outlined">person</span>}
                    </li>
                )}
            </ul>
            </div>
        </div>
    );
};

export default Menu;