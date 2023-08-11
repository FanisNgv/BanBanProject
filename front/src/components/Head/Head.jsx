import helmet, {Helmet} from "react-helmet";
import React from 'react';


const Head =()=>{
    return(
        <div>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@700&display=swap" rel="stylesheet"/>
                <link rel="shortcut icon" href="../../public/BanBanIcon.png" type="image/x-icon"/>
            </Helmet>
        </div>
    )
}
export default Head;