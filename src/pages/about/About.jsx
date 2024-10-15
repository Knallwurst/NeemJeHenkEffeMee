import styles from "./About.module.css";
import painful from "../../assets/Painful Harold PNG.png";

function About() {
    return (
        <div>
            <h2 className={styles["about-text"]}>
                Altijd al een tweedehands auto willen kopen maar geen idee waar je op moet letten?
            </h2>
            <div className={styles["painful-wrapper"]}>
                <img className={styles["painful"]} src={painful} alt="painful harold"/>
            </div>

            <h2 className={styles["about-text"]}> Waarom wij?</h2>

            <p className={styles["about-text"]}>
                Niet iedereen heeft het budget voor een nieuwe auto, maar mobiliteit is essentieel. Daarom zijn
                tweedehands auto&#39;s vaak een ideale keuze, bijvoorbeeld wanneer het openbaar vervoer niet altijd de beste
                optie is. Alleen heeft niet iedereen de juiste ervaring of know-how om te weten welke auto nou de juiste
                keuze is.
                Of als je al een auto hebt gevonden maar ook helemaal geen idee hebt waar je allemaal op moet letten.
            </p>

            <h4 className={styles["about-text"]}>
                Kies daarom voor &#39;Neem Je Henk Effe Mee&#39;!
            </h4>

            <p className={styles["about-text"]}>
                Ons platform verbindt je met lokale experts die jou
                begeleiden door het vaak complexe proces van het kopen van een tweedehands auto.
            </p>

            <p className={styles["about-text"]}>
                Via ons vind je onafhankelijke, betrouwbare experts die altijd in jouw belang handelen.
                De specialisten voeren grondige inspecties uit, zodat jij met een gerust hart kunt kiezen. Zij
                zorgen ervoor dat je geen kat in de zak koopt, maar een auto die perfect aansluit op jouw wensen en
                behoeften.
            </p>

            <h2 className={styles["about-text"]}>Waarom kiezen voor ons platform?</h2>

            <ul className={styles["about-text"]}>
                <li>
                    <strong>Deskundig advies</strong>: Geregistreerde experts delen hun jarenlange ervaring met jou
                    en helpen je de beste keuzes te maken.
                </li>
                <li>
                    <strong>Geen verborgen gebreken</strong>: Door een uitgebreide inspectie van de auto voorkom je
                    dure verrassingen achteraf.
                </li>
                <li>
                    <strong>Kostenbesparing</strong>: Met ons platform investeer je in een auto die betrouwbaar is
                    en je veel reparatiekosten bespaart.
                </li>
                <li>
                    <strong>Tijdwinst</strong>: Wij koppelen je direct aan experts en beschikbare auto&#39;s, waardoor
                    je tijd bespaart.
                </li>
                <li>
                    <strong>Zekerheid en vertrouwen</strong>: Lees beoordelingen van eerdere klanten en kies met
                    vertrouwen de expert die bij jou past.
                </li>
                <li>
                    <strong>Duurzaamheid</strong>: Door tweedehands auto&#39;s te kiezen, draag je bij aan een duurzamer
                    milieu en geef je auto&#39;s een tweede leven.
                </li>
                <li>
                    <strong>Ondersteuning van lokale experts</strong>: Onze experts komen uit jouw regio. Zo steun
                    je de lokale economie én krijg je hulp van iemand die de markt door en door kent.
                </li>
            </ul>

            <p className={styles["about-text"]}>
                Bij ons ben je verzekerd van een betrouwbare (tweedehands) auto, zonder de onzekerheden die vaak
                gepaard gaan met het kopen van een tweedehands voertuig. Wij staan voor transparantie, vertrouwen en gemak – zodat jij
                kunt focussen op wat echt telt: veilig en zorgeloos de weg op.
            </p>

        </div>
    );
}

export default About;