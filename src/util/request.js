export async function sendVerification(user, appCheck) {
    try {
        if (!user) {
            return { status: 500, message: 'You muse be logged in to make this request' };
        }

        const token = await user.getIdToken();
        const res = await fetch('http://localhost:8000/verify',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            },
        });

        return { status: 200, ...await res.json() };
    } catch (error) {
        console.error('ERROR ALERT:', error);
        return { status: 500, message: error.message };
    }
}

export async function sendPasswordReset(email, appCheck) {
    try {
        const res = await fetch('http://localhost:8000/reset',{
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'content-type': 'application/json',
                'X-Firebase-AppCheck': await appCheck()
            }
        });

        return await res.json();
    } catch (error) {
        console.error('ERROR ALERT:', error);
        return { message: error.message };
    }
}

export async function getUniversities(appCheck) {
    try {
        const response = await fetch('http://localhost:8000/universities', {
            headers: {'X-Firebase-AppCheck': await appCheck()}
        });

        if (!response.ok) {
            console.error(`ERROR ALERT: HTTP error! Status: ${response.status}`);
            return [];
        }
        const data = await response.json();

        // Ensure the 'universities' key exists and is an array
        if (!data.universities || !Array.isArray(data.universities)) {
            console.error('ERROR ALERT: Invalid data format: Expected a "universities" key with an array.');
            return [];
        }

        return data.universities.map(university => ({
            _id: university._id.toString(), // Convert ObjectId to string
            name: university.name,
            imgSrc: university.imgSrc,
        }));
    } catch (error) {
        console.error('ERROR ALERT:', error);
        return [];
    }
}

export async function getMajors(appCheck) {
    try {
        const response = await fetch('http://localhost:8000/majors', {
            headers: {'X-Firebase-AppCheck': await appCheck()}
        });

        if (!response.ok) {
            console.error(`ERROR ALERT: HTTP error! Status: ${response.status}`);
            return [];
        }
        const data = await response.json();

        // Ensure the 'universities' key exists and is an array
        if (!data.majors || !Array.isArray(data.majors)) {
            console.error('ERROR ALERT: Invalid data format: Expected a "majors" key with an array.');
            return [];
        }

        return data.majors.map(major => ({
            _id: major._id.toString(), // Convert ObjectId to string
            name: major.name
        }));
    } catch (error) {
        console.error('ERROR ALERT:', error);
        return [];
    }
}

export async function getEssays(user, appCheck) {
    try {
        if (!user) {
            return [];
        }

        const token = await user.getIdToken();
        const res = await fetch('http://localhost:8000/essays',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            },
        });
        const json = await res.json()

        return json.items;
    } catch (error) {
        console.error('ERROR ALERT:', error);
    }
}

export async function postEssays(user, essays, appCheck) {
    try {
        if (!user) {
            return { status: 0, message: 'You must be logged in to make this request' };
        }

        const token = await user.getIdToken();
        console.log(essays);
        const res = await fetch('http://localhost:8000/essays',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            },
            body: JSON.stringify(essays)
        });
        const json = await res.json();

        return { status: res.status, body: json };
    } catch (error) {
        console.error('ERROR ALERT:', error);
    }
}

export async function getProfile(user, section, appCheck) {
    try {
        if (!user) {
            return {};
        }

        const token = await user.getIdToken();
        const params = new URLSearchParams({ section })
        const res = await fetch('http://localhost:8000/profile?' + params.toString(),{
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            }
        });
        return await res.json();
    } catch (error) {
        console.error('ERROR ALERT:', error);
    }
}

export async function postProfile(user, section, data, appCheck) {
    try {
        if (!user) {
            return { status: 0, message: 'You must be logged in to make this request' };
        }

        const token = await user.getIdToken();
        const params = new URLSearchParams({ section })
        const res = await fetch('http://localhost:8000/profile?' + params.toString(),{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        return { status: res.status, body: json };
    } catch (error) {
        console.error('ERROR ALERT:', error);
    }
}

export async function postUser(user, appCheck) {
    try {
        if (!user) {
            return { message: 'You muse be logged in to make this request' };
        }

        const token = await user.getIdToken();
        const res = await fetch('http://localhost:8000/user',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            },
        });

        return await res.json();
    } catch (error) {
        console.error('ERROR ALERT:', error);
        return { message: error.message };
    }
}

export async function removeUser(user, appCheck) {
    try {
        if (!user) {
            return { message: 'You muse be logged in to make this request' };
        }

        const token = await user.getIdToken();
        const res = await fetch('http://localhost:8000/user',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Firebase-AppCheck': await appCheck()
            },
        });

        return await res.json();
    } catch (error) {
        console.error('ERROR ALERT:', error);
        return { message: error.message };
    }
}