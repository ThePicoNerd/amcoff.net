import styles from "./Grid.module.css";

export default function Grid() {
  return (
    <main className={styles.grid}>
      <div className="text-2xl aspect-square">
        <a href="https://github.com/akeamc" className="hover:text-black">
          @akeamc on Github
        </a>
      </div>
      <h1 className={styles.heading}>
        Åke
        <br />
        Amcoff
      </h1>
      <img
        src="/profile.jpg"
        alt="Profile"
        className="col-start-3 max-md:row-span-2 max-md:row-start-4 max-md:col-end-5"
      />
      <p className={styles.text}>2005</p>
    </main>
  );
}
