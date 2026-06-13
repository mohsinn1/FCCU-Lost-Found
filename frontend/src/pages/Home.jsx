import { Link } from 'react-router-dom'
import './Home.css'

function Home(){
    return(
        <div className='home-page'>
            <section className='home-hero'>
                <p className='eyebrow-text'>FCCU CAMPUS COMMUNITY</p>
                <h1 className='main-heading'>
                    <span className='heading-highlight'> Reconnect <br/></span>
                    Lost Items
                </h1>
                <p className='description'>
                    A trusted campus space for FCCU students to report,
                    discover, and recover lost belongings.
                </p>

                <div className='item-links'>
                    <Link className='primary-link' to='/items'>
                        Browse Items
                    </Link>
                    <Link className='secondary-link' to='/add-item'>
                        Report an Item
                    </Link>
                </div>
            </section>

            <section className='home-process' aria-labelledby='process-heading'>
                <div className='process-heading'>
                    <p className='eyebrow-text'>HOW IT WORKS</p>
                    <h2 id='process-heading'>A simple path back to what matters</h2>
                </div>

                <div className='how-it-works'>
                    <article>
                        <span className='step-number'>01</span>
                        <h3>Report</h3>
                        <p>
                            Share the item details, campus location, and a
                            clear photo.
                        </p>
                    </article>

                    <article>
                        <span className='step-number'>02</span>
                        <h3>Discover</h3>
                        <p>
                            Search recent reports and filter listings to find
                            a possible match.
                        </p>
                    </article>

                    <article>
                        <span className='step-number'>03</span>
                        <h3>Reconnect</h3>
                        <p>
                            Contact the student who posted it and safely
                            recover the item.
                        </p>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default Home
