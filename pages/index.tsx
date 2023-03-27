import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import Workspace from "@/components/Workspace";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>System Designer</title>
                <meta name="description" content="A web tool that helps you plan your application infrastructure and architecture with ease." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className={styles.header}>
                <nav>
                    <ul className={styles.links}>
                        <li><a href="#">System Designer</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Help</a></li>
                    </ul>
                    <ul className={styles.social}>
                        <li><a href="https://github.com/JohanVonElectrum/system-designer" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a></li>
                    </ul>
                </nav>
            </header>
            <main className={styles.main}>
                <div className={[styles.hero, inter.className].join(" ")}>
                    <h1>System Designer</h1>
                    <h2>A web tool that helps you plan your application infrastructure and architecture with ease.</h2>
                </div>
                <Workspace services={{
                    "l4-lb": { id: "l4-lb", name: "L4 Load Balancer", description: "Send traffic to different locations using a DNS.", attrs: {} },
                    "l7-lb": { id: "l7-lb", name: "L7 Load Balancer", description: "Select a target location based on the request content.", attrs: {} },
                    "c11d-svc": { id: "c11d-svc", name: "Containerized Service", description: "A container to deploy a service.", attrs: {} },
                    "nsql-db": {
                        id: "nsql-db", name: "NoSQL Database", description: "A NoSQL database to store data with flexible schemas.", attrs: {
                            type: {
                                name: "Data representation",
                                type: "document|key-value|graph|wide-column"
                            }
                        }
                    }
                }} />
            </main>
        </>
    );
}
