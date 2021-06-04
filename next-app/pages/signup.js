import Head from 'next/head'
import Router from 'next/router';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import React, {useState} from 'react';

const Signup = () => {
    const [signupError, setSignupError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:3003/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, phone, email, password }),
        }).then((r) => {
            return r.json()
        }).then((res) => {
            console.log("signUp response:"+JSON.stringify(res));
            if (res && res.status === "ERROR") {
                setSignupError(res.message);
            }
            if (res && res.status === "SUCCESS") {
                console.log(JSON.stringify(res.data));
                Router.push({
                    pathname: '/verifyOtp', query: { id: res.data.id },
                })
            }
        });
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>SignUp</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form onSubmit={handleSubmit}>
                <h4>Sign Up</h4>
                <label htmlFor="firstName"> FirstName
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} name="firstName" type="firstName" />
                </label>
                <br /> <br />

                <label htmlFor="lastName"> LastName
                    <input value={lastName}onChange={(e) => setLastName(e.target.value)} name="lastName" type="lastName" />
                </label>
                <br /><br />

                <label htmlFor="phone"> Phone
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" type="phone" />
                </label>
                <br /> <br />
                <label htmlFor="email"> Email
                    <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" />
                </label>

                <br /> <br />
                <label htmlFor="password"> Password
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" />
                </label>
                <br /> <br />

                <input type="submit" value="Submit" />
                {signupError && <p style={{color: 'red'}}>{signupError}</p>}
            </form>
            <>
            Already Have Account<Link  href="/login">Login</Link>
            </>
        </div>
    );
};

export default Signup;