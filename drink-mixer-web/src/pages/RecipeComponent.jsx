import React, { useState, useEffect } from 'react'

const RecipeComponent = ({ recipes }) => {
    useEffect(() => {
        console.log('recipes', recipes);
    }, [])
    return (
        <div>RecipeComponent</div>
    )
}

export default RecipeComponent