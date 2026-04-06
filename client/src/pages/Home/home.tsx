import { useState } from "react";
import photo from "../../assets/photo.jpg";
import "./home.css";

type Tab = "about" | "experiences" | "honors" | "projects";

const Home = () => {
    const [activeTab, setActiveTab] = useState<Tab>("about");

    return (
        <main className="portfolio">
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-photo-wrap">
                        <img
                            className="hero-photo"
                            src={photo}
                            alt="Profile photo"
                        />
                    </div>
                    <div className="hero-text">
                        <p className="hero-label">ENGINEERING PORTFOLIO</p>
                        <h1 className="hero-name">TJ Moody</h1>
                        <p className="hero-tagline">
                            BSE. Computer Science · University of Michigan · Class of 2028
                        </p>
                    </div>
                </div>
            </section>

            <nav className="tab-nav">
                {(["about", "experiences", "honors", "projects"] as Tab[]).map(
                    (tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? "tab-btn--active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "about" && "About Me"}
                            {tab === "experiences" && "Experiences"}
                            {tab === "honors" && "Honors Plan"}
                            {tab === "projects" && "Projects"}
                        </button>
                    ),
                )}
            </nav>

            <div className="tab-content">
                {activeTab === "about" && (
                    <section className="section about">
                        <div className="section-body">
                            <p>
                                I'm a sophomore in Computer Science at the
                                University of Michigan's College of Engineering,
                                from New York. I'm curious and passionate about
                                lifelong learning, and so I greatly enjoy
                                keeping a collection of pet projects. Outside
                                the classroom, I captain BagnUM, Michigan's club
                                ultimate frisbee B team, and love travel, having
                                just completed a study abroad in Madrid this
                                past summer. I also enjoy skiing, cooking, and
                                reading.
                            </p>
                        </div>
                    </section>
                )}

                {activeTab === "experiences" && (
                    <section className="section experiences">
                        <article className="experience-card">
                            <h3 className="exp-title">
                                Engineering Abroad — Madrid, Spain
                            </h3>
                            <p className="exp-meta">
                                University of Michigan · June – July 2025
                            </p>
                            <p className="exp-desc">
                                I spent the summer studying abroad in Madrid
                                through Michigan's Engineering Abroad program.
                                Spain wasn't entirely new to me — I'd visited
                                before to see family — but being immersed in the
                                language and culture, and navigating daily life
                                in a foreign city, reinforced how much I value
                                stepping outside familiar environments and
                                exposing myself to differing backgrounds and
                                worldviews.
                            </p>
                        </article>

                        <article className="experience-card">
                            <h3 className="exp-title">
                                Captain — BagnUM Ultimate Frisbee
                            </h3>
                            <p className="exp-meta">
                                University of Michigan · September 2024 –
                                Present
                            </p>
                            <p className="exp-desc">
                                As captain of Michigan's club ultimate frisbee B
                                team, I'm responsible for managing travel and
                                monetary logistics between our roster, the
                                university, and the sport's governing body. It's
                                taught me to balance the logistical
                                responsibilities of leadership with trust and
                                personal connection.
                            </p>
                        </article>
                    </section>
                )}

                {activeTab === "honors" && (
                    <section className="section honors">
                        <div className="honors-block">
                            <h3 className="honors-subtitle">
                                Competency Worksheet
                            </h3>
                            <p className="honors-note">
                                Based on the MPortfolio Competency Assessment.
                            </p>

                            {[
                                {
                                    title: "Communication",
                                    rating: "Proficient",
                                    reflection:
                                        "Between wrangling the frisbee team and my peers in leadership, and facing similar challenges coordinating with partners on lengthy programming projects, I've gained significant experience in this area recently.",
                                },
                                {
                                    title: "Entrepreneurial Mindset",
                                    rating: "Developing",
                                    reflection:
                                        "Most of my personal projects start from a simple curiosity about a field or technology — I want to develop that instinct more intentionally, moving from building for learning toward building with a clearer sense of purpose and impact.",
                                },
                                {
                                    title: "Ethics",
                                    rating: "Developing",
                                    reflection:
                                        "Computer science raises real ethical questions around privacy, access, and how systems affect people, and I try to think carefully about those implications in my work, but more academic applications have not given me many opportunities to do so yet.",
                                },
                                {
                                    title: "Empathy",
                                    rating: "Proficient",
                                    reflection:
                                        "Captaining a team with players at very different skill levels has required me to meet people where they are rather than where I want them to be. I've learned to pay attention to how individuals respond to feedback and adjust accordingly.",
                                },
                                {
                                    title: "Leadership",
                                    rating: "Proficient",
                                    reflection:
                                        "Leading BagnUM has been my most direct experience with leadership so far. Managing logistics, keeping people motivated through a long season, and making decisions on the fly has been a genuinely fun learning period.",
                                },
                                {
                                    title: "Systems Thinking",
                                    rating: "Developing",
                                    reflection:
                                        "A lot of what draws me to computer science is the challenge of understanding how complex systems fit together. I want to develop this more deliberately, particularly as I take on larger and more interdependent projects.",
                                },
                                {
                                    title: "Global & Cultural Awareness",
                                    rating: "Exemplary",
                                    reflection:
                                        "Studying abroad in Madrid, combined with prior visits to Spain to visit family, gave me a real appreciation for how much context shapes the way people think and work. I'm proficient in Spanish and want to continue finding ways to engage internationally.",
                                },
                                {
                                    title: "Creativity",
                                    rating: "Proficient",
                                    reflection:
                                        "A lot of my personal projects start without a clear roadmap — I find a problem interesting and figure out the solution as I go. Working through something genuinely open-ended has been my main outlet for creative thinking.",
                                },
                                {
                                    title: "Grit & Resilience",
                                    rating: "Developing",
                                    reflection:
                                        "The projects I'm most proud of are the ones that required me to sit with being stuck for a while. Learning to treat that discomfort as part of the process rather than a sign to stop is something I want to work on more actively.",
                                },
                                {
                                    title: "Risk Management",
                                    rating: "Developing",
                                    reflection:
                                        "I hope to join a research team with more real-world stakes to get experience in this area, where projects have impact on real communities and costs beyond just my own time and attention.",
                                },
                                {
                                    title: "Lifelong Learning",
                                    rating: "Exemplary",
                                    reflection:
                                        "This is probably the value I feel most strongly about. I maintain personal projects across a wide range of topics because I find learning enjoyable, which is the reason I chose my major in the first place.",
                                },
                                {
                                    title: "Teamwork",
                                    rating: "Proficient",
                                    reflection:
                                        "The last two semesters, my coursework in computer science has been almost entirely collaborative, giving me plenty of opportunities to work through differing ideas, philosophies, and schedules toward a shared final product.",
                                },
                            ].map((comp) => (
                                <div
                                    className="competency-row"
                                    key={comp.title}
                                >
                                    <div className="comp-row-title">
                                        {comp.title}
                                    </div>
                                    <div className="comp-row-body">
                                        <div className="comp-row-item">
                                            <span className="comp-row-label">
                                                Self-Rating
                                            </span>
                                            <span className="comp-row-value">
                                                {comp.rating}
                                            </span>
                                        </div>
                                        <div className="comp-row-item">
                                            <span className="comp-row-label">
                                                Reflection
                                            </span>
                                            <span className="comp-row-value">
                                                {comp.reflection}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="honors-block">
                            <h3 className="honors-subtitle">SMART Goals</h3>

                            {[
                                {
                                    title: "Pursue an Undergraduate Research Position",
                                    details: {
                                        Specific:
                                            "Find an undergraduate research position within the College of Engineering whose work intersects with my interests in computer science.",
                                        Measurable:
                                            "Reach out to at least 10 professors with a tailored email and CV by the end of Winter 2026 semester.",
                                        Achievable:
                                            "I have relevant coursework and project experience to contribute meaningfully to a research group.",
                                        Relevant:
                                            "Research experience would deepen my technical knowledge and expose me to problems beyond what coursework covers.",
                                        "Time-bound":
                                            "Position secured by end of Winter 2026 semester.",
                                    },
                                },
                                {
                                    title: "Complete a Substantial Independent Project End-to-End",
                                    details: {
                                        Specific:
                                            "Design, build, and publicly release a complete software project outside of coursework.",
                                        Measurable:
                                            "Project is documented, deployed, and shared publicly by end of Winter 2026 semester.",
                                        Achievable:
                                            "I have the technical foundation and have shipped smaller projects before.",
                                        Relevant:
                                            "Building something complete and public develops both technical and communication skills.",
                                        "Time-bound":
                                            "Finished and released this year.",
                                    },
                                },
                            ].map((g) => (
                                <div className="smart-card" key={g.title}>
                                    <h4 className="smart-title">{g.title}</h4>
                                    <ul className="smart-list">
                                        {[
                                            "Specific",
                                            "Measurable",
                                            "Achievable",
                                            "Relevant",
                                            "Time-bound",
                                        ].map((s) => (
                                            <li key={s}>
                                                {
                                                    g.details[
                                                        s as keyof typeof g.details
                                                    ]
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "projects" && (
                    <section className="section projects">
                        {[
                            {
                                name: "zerobrew",
                                url: "https://github.com/tj-moody/zerobrew",
                                description:
                                    "A drop-in, significantly faster experimental alternative to Homebrew. A contribution to an open source project.",
                                language: "Rust",
                                forked: true,
                            },
                            {
                                name: "teejsite",
                                url: "https://github.com/tj-moody/teejsite",
                                description:
                                    "A full-stack monorepo — the site you're looking at right now.",
                                language: "TypeScript",
                                forked: false,
                            },
                            {
                                name: "switchyard",
                                url: "https://github.com/tj-moody/switchyard",
                                description:
                                    "A library implementing a work-stealing thread pool for efficient task distribution across threads.",
                                language: "C++",
                                forked: false,
                            },
                            {
                                name: "rasterbox",
                                url: "https://github.com/tj-moody/rasterbox",
                                description:
                                    "A toy software rasterizer, built to understand rendering algorithms and GPU architecture from the ground up.",
                                language: "C++",
                                forked: false,
                            },
                            {
                                name: "tnewt_rs",
                                url: "https://github.com/tj-moody/tnewt_rs",
                                description:
                                    "A chess engine and move generation library, optimized through iterative benchmarking.",
                                language: "Rust",
                                forked: false,
                            },
                        ].map((project) => (
                            <a
                                key={project.name}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-card"
                            >
                                <div className="project-card-header">
                                    <h3 className="project-name">
                                        {project.name}
                                    </h3>
                                    {project.forked && (
                                        <span className="project-tag">
                                            Open Source
                                        </span>
                                    )}
                                </div>
                                <p className="project-desc">
                                    {project.description}
                                </p>
                                <span className="project-lang">
                                    {project.language}
                                </span>
                            </a>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
};

export default Home;
