'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container, Grid, Typography, Box, Card, CardActionArea, CardContent } from '@mui/material'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useUser } from '@clerk/nextjs' 

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcards() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        if (isLoaded && isSignedIn) {
            getFlashcards()
        }
    }, [search, user, isLoaded, isSignedIn])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',
                                            perspective: '1000px',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                transformStyle: 'preserve-3d',
                                                transition: 'transform 0.6s',
                                                transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                <Typography variant="h5" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'lightgray',
                                                }}
                                            >
                                                <Typography variant="h5" component="div">
                                                    {flashcard.back}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}