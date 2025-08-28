import { useContext, useEffect, useState } from 'react';
import { userDatabase } from '../../fictional database/db';
import styles from './FavoriteGarages.module.css';
import { AuthContext } from '../../context/AuthContext';
import { pullUserInfo, pushUserInfo } from '../../data/novi/UserInfoApi';

function FavoriteGarages() {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    // ALL garages
    const allGarages = userDatabase;

    // ID's van gebruikers' geselecteerde experts dat we halen van NOVI back-end
    const [favoriteGarageIds, setFavoriteGarageIds] = useState([]);
    useEffect(() => {
        const loadFavoriteGarages = async () => {
            if (!user?.username || !token) {
                return;
            }

            // Haal data van cloud
            const userInfo = await pullUserInfo(user.username, token);

            // Update UI
            setFavoriteGarageIds(userInfo.starredGarages);
        };

        loadFavoriteGarages();
    }, [user?.username, token]);

    // Functie om expert te verwijderen
    const handleRemoveFavorite = async (garageId) => {
        // Creëer nieuwe lijst van gemarkeerde experts
        let updatedFavoriteGarageIds = favoriteGarageIds.filter(favoriteGarageId => favoriteGarageId !== garageId);

        // 2. Update UI
        setFavoriteGarageIds(updatedFavoriteGarageIds);

        // 3. Push ge-updatete data naar cloud
        const updatedUserInfo = { starredGarages: updatedFavoriteGarageIds, defaultFilters: [] /* not important yet */ };
        try {
            await pushUserInfo(user.username, token, updatedUserInfo);
        } catch (error) {
            confirm("Het lukte niet om deze te verwijderen. Check de console voor meer informatie");
            console.error(error);
        }
    };


    // Favoriete experts
    const favoriteGarages = allGarages.filter(garage => favoriteGarageIds.includes(garage.id));

    console.log(favoriteGarages);

    return (
        <div className={styles["favorites-page-container"]}>
            <h2>⭐ Favoriete garages</h2>
            <p>Voeg favoriete garages toe via de <a href="./">Home pagina</a>.</p>
            {favoriteGarages.map(garage => (
                // eslint-disable-next-line react/jsx-key
                <div className={styles["list-container"]}>
                    <div className={styles["item-container"]}>
                        <h3>{garage.name}</h3>
                        <p>{garage.profession}</p>
                        <p>Adres: {garage.address}</p>
                        <p>Email: {garage.email}</p>
                        <p>Ervaring: {garage.experience} jaar</p>
                        <button onClick={() => handleRemoveFavorite(garage.id)}>❌</button>
                        <button onClick={() => window.open(`mailto:${garage.email}`, '_blank')}>📧</button>
                        <button onClick={() => alert(`Start chat met ${garage.name}`)}>💬</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FavoriteGarages;
