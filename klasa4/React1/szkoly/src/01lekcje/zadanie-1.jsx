
function Profil({username, email, avatar}) {
    
    return (
        <>
            <div>
                <img src={avatar} alt="avatar" />
                <h2>{username}</h2>
                <p>{email}</p>
            </div>
        </>
    )

}

export default Profil;