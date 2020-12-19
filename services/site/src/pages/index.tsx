import React from "react";
import Card from "app/components/Card";

const Home = () => {
    return <main className="flex justify-center items-center w-screen h-screen">
        <Card heading={<h1>A11y Challenges</h1>}>
            <p>Welcome to a11y-challenges.cool! This is a project created by Michael Brandstätter, Thomas Dax,
                Daniela Kubesch and Luca Pircher during their MMT Master degree program at FH Salzburg</p>
        </Card>
    </main>
}

export default Home
