import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./About.module.css";
import diagnostics from "../../assets/Car Diagnostics.webp";

function About() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className={styles["about-content"]}>
            <h1 className={styles["about-title"]}>
                Vind een lokale expert die jou adviseert
            </h1>
            <div className={styles["diagnostics-wrapper"]}>
                <img className={styles["diagnostics"]} src={diagnostics} alt="car diagnostics"/>
            </div>

            <div className={styles["about-text-wrapper"]}>
                <p className={styles["about-text-1"]}>
                    Niet iedereen heeft het budget voor een nieuwe auto, maar mobiliteit is essentieel. Daarom zijn
                    tweedehands auto&#39;s vaak een ideale keuze, bijvoorbeeld wanneer het openbaar vervoer niet
                    altijd de beste optie is. Alleen heeft niet iedereen de juiste ervaring of know-how om te weten
                    welke auto nou
                    de juiste keuze is.
                    Of als je al een auto hebt gevonden maar ook helemaal geen idee hebt waar je allemaal op moet
                    letten.
                </p>

                <p className={styles["about-text-2"]}>
                    Ons platform verbindt je met lokale experts die jou
                    begeleiden door het vaak complexe proces van het kopen van een tweedehands auto.
                </p>

                <p className={styles["about-text-3"]}>
                    Via ons vind je onafhankelijke, betrouwbare experts die altijd in jouw belang handelen.
                    De specialisten voeren grondige inspecties uit, zodat jij met een gerust hart kunt kiezen. Zij
                    zorgen ervoor dat je geen kat in de zak koopt, maar een auto die perfect aansluit op jouw wensen
                    en
                    behoeften.
                </p>
                <p>
                    Bij ons ben je verzekerd van een betrouwbare (tweedehands) auto, zonder de onzekerheden die vaak
                    gepaard gaan met het kopen van een tweedehands voertuig. Wij staan voor transparantie, vertrouwen en
                    gemak – zodat jij
                    kunt focussen op wat echt telt: veilig en zorgeloos de weg op.
                </p>
            </div>

            <h2 className={styles["about-text"]}>Waarom kiezen voor ons platform?</h2>

            <div className={styles["accordion"]}>
                {[
                    {
                        title: "Deskundig advies",
                        content:
                            "Geregistreerde experts delen hun jarenlange ervaring met jou en helpen je de beste keuzes te maken.",
                    },
                    {
                        title: "Geen verborgen gebreken",
                        content:
                            "Door een uitgebreide inspectie van de auto voorkom je dure verrassingen achteraf.",
                    },
                    {
                        title: "Kostenbesparing",
                        content:
                            "Met ons platform investeer je in een auto die betrouwbaar is en je veel reparatiekosten bespaart.",
                    },
                    {
                        title: "Tijdwinst",
                        content:
                            "Wij koppelen je direct aan experts en beschikbare auto's, waardoor je tijd bespaart.",
                    },
                    {
                        title: "Zekerheid en vertrouwen",
                        content:
                            "Lees beoordelingen van eerdere klanten en kies met vertrouwen de expert die bij jou past.",
                    },
                    {
                        title: "Duurzaamheid",
                        content:
                            "Door tweedehands auto's te kiezen, draag je bij aan een duurzamer milieu en geef je auto's een tweede leven.",
                    },
                    {
                        title: "Ondersteuning van lokale experts",
                        content:
                            "Onze experts komen uit jouw regio. Zo steun je de lokale economie én krijg je hulp van iemand die de markt door en door kent.",
                    },
                ].map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`${styles["accordion-item"]} ${isOpen ? styles["open"] : ""}`}
                        >
                            <button
                                className={styles["accordion-title"]}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                            >
                                {item.title}
                            </button>
                            {isOpen && <div className={styles["accordion-content"]}>{item.content}</div>}
                        </div>
                    );
                })}
            </div>

            <h2 className={styles["overtuigd-title"]}>Overtuigd?</h2>

            <div className={styles["verwijs-button-container"]}>
                <Link to="/register" className={styles["verwijs-button"]}>
                    Registreer je hier
                </Link>
                <Link to="/login" className={styles["verwijs-button"]}>
                    Klik hier als je al een account hebt
                </Link>
            </div>

        </div>
    );
}

export default About;