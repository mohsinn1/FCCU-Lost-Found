import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import './ItemDetails.css'

function ItemDetails(){
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const {id} = useParams()

    useEffect(() => {
        async function getItem(){
            try{const response = await fetch(`http://127.0.0.1:8000/api/items/${id}/`)
            const data = await response.json()
            if (!response.ok){
                throw new Error('Could not load item details')}

            setItem(data) }

            catch (error){
                setError(error.message)
            }
            finally{
                setLoading(false)
            }

        }

        getItem()

    }, [id]);

    if (loading){
    return <p>Loading item details...</p>
    }

    if (error){
        return <p className="form-error">{error}</p>
    }

    return(
        <div className="item-details-page">
            <Link className="details-back-link" to="/items">
                Back to items
            </Link>

            <section className="details-card">
                <div className="details-image-wrapper">
                    <img
                        className="details-image"
                        src={item.image}
                        alt={item.title}
                    />
                </div>

                <div className="details-content">
                    <div className="details-labels">
                        <span className="details-category">{item.category}</span>
                        <span className="details-status">{item.status}</span>
                    </div>

                    <h1>{item.title}</h1>
                    <p className="details-description">{item.description}</p>

                    <div className="details-information">
                        <div>
                            <span>Location</span>
                            <p>{item.location}</p>
                        </div>

                        <div>
                            <span>Date</span>
                            <p>{item.date_lost_found}</p>
                        </div>

                        <div>
                            <span>Reported By</span>
                            <p>{item.created_by_name}</p>
                        </div>

                        <div>
                            <span>Contact Number</span>
                            <p>{item.contact_info}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ItemDetails
