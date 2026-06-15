import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import './Items.css'
import './MyItems.css'
import getErrorMessage from '../utils/getErrorMessage'

function MyItems(){
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleteItemId, setDeleteItemId] = useState(null)


    useEffect(() => {
        async function fetchMyItems(){
            try{
                const token = localStorage.getItem('token')

                if (!token){
                    throw new Error('You must be logged in to view your items.')
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/items/my-items/',
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    },
                )

                const data = await response.json()

                if (response.status === 401){
                    throw new Error('Your session has expired. Please log in again.')
                }

                if (!response.ok){
                    throw new Error(getErrorMessage(data))
                }

                setItems(data)
            } catch(error){
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }

        fetchMyItems()
    }, [])

    async function handleMarkClaimed(itemId){
        setError('')

        try{
            const token = localStorage.getItem('token')

            if (!token){
                throw new Error('You must be logged in to manage your items.')
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/items/${itemId}/mark-claimed/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            )

            const updatedItem = await response.json()

            if (response.status === 401){
                throw new Error('Your session has expired. Please log in again.')
            }

            if (!response.ok){
                throw new Error(getErrorMessage(updatedItem))
            }

            setItems(items.map((item) => {
                if (item.id === itemId){
                    return updatedItem
                }

                return item
            }))
        } catch(error){
            setError(error.message)
        }
    }

    async function handleDelete(itemId){
        setError('')

        try{
            const token = localStorage.getItem('token')

            if (!token){
                throw new Error('You must be logged in to manage your items.')
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/items/${itemId}/`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            )

            if (response.status === 401){
                throw new Error('Your session has expired. Please log in again.')
            }

            if (!response.ok){
                const data = await response.json()
                throw new Error(getErrorMessage(data))
            }

            setItems(items.filter((item) => item.id !== itemId))
            setDeleteItemId(null)
        } catch(error){
            setError(error.message)
        }
    }


    if (loading){
        return <p className="items-message">Loading your items...</p>
    }

    if (error){
        return <p className="items-error">{error}</p>
    }

    return(
        <div className="items-page">
            <section className="items-heading my-items-heading">
                <p className="items-eyebrow">YOUR FCCU LOST & FOUND POSTS</p>
                <h1>
                    My <span>Items</span>
                </h1>
                <p>
                    Review and manage the lost or found items you have reported.
                </p>
            </section>

            {items.length === 0 ? (
                <div className="my-items-empty">
                    <p>You have not reported any items yet.</p>
                    <Link to="/add-item">Report your first item</Link>
                </div>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <article
                            className={`item-card ${item.status === 'Claimed' ? 'item-card-claimed' : ''}`}
                            key={item.id}
                        >
                            <Link className="item-card-link" to={`/items/${item.id}`}>
                                <div className="item-image-wrapper">
                                    <img
                                        className="item-image"
                                        src={item.image}
                                        alt={item.title}
                                    />

                                    <span className="item-category">{item.category}</span>

                                    {item.status === 'Claimed' && (
                                        <div className="claimed-mark" aria-label="Item claimed">
                                            <span>Claimed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="item-card-content">
                                    <h2>{item.title}</h2>

                                    <div className="item-details">
                                        <p>
                                            <span>Location</span>
                                            {item.location}
                                        </p>
                                        <p>
                                            <span>Date</span>
                                            {item.date_lost_found}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <div className="my-item-actions">
                                <Link
                                    className="my-item-edit"
                                    to={`/items/${item.id}/edit`}
                                >
                                    Edit
                                </Link>
                                {deleteItemId === item.id ? (
                                    <div className="delete-confirmation">
                                        <button
                                            className="delete-confirm"
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            aria-label="Confirm delete"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            className="delete-cancel"
                                            type="button"
                                            onClick={() => setDeleteItemId(null)}
                                            aria-label="Cancel delete"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="my-item-delete"
                                        type="button"
                                        onClick={() => setDeleteItemId(item.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                                {item.status !== 'Claimed' && (
                                    <button
                                        type="button"
                                        onClick={() => handleMarkClaimed(item.id)}
                                    >
                                        Mark Claimed
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyItems
