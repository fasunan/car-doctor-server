/**
 * ---------------------------
 *      MAKE API SECURE
 * ---------------------------
 * The person who should have 
 * 
 * concept: 
 * 1. assign two tokens for each person (access token, refresh token)
 * 2. access token contains: user identification (email, role, etc.). valid for a shorter duration 
 * 3. refresh token is used: to recreate an access token that was expired.
 * 4. if refresh is invalid then logout the user 
 * 
 * 
*/

/**
 * 1. jwt --> json web token
 * 2. generate a token by using jwt.sign (require('crypto').randomBytes(64).toString('hex') on terminal)
 * 3. create api set to cookie. http only, secure, sameSite *=> process bellow
 * ( const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'}) res
            .cookie('token', token, {
                httpOnly:true,
                secure: false,
                
            })
            .send({success: true});
            ) 
 * 4. from client side: axios withCredentials true
 * 5. cors setup origin and credentials: true 
 * // important settings
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials:true
}));
 * 
*/

/**
 * 1. for secure api calls
 * 2. server side: install cookie parser and use it as a middleware
 * 3. req.cookies 
 * 4. on the client side: make api call using axios withCredentials: true (or credentials include while using fetch)
 * 5.  
*/


// install jwt web token and cookie parser
// require them and use
// user jokhon login korbe tokhon cookie generate korbe. er jonno tarminal e cookie generate korte hobe nicher typing code ta diye
// require('crypto').randomBytes(64).toString('hex') je code ta dibe seta .env te rekhe dite hobe.
// than 
/*
 create api set to cookie. http only, secure, sameSite *=> process bellow
 
    
 const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'}) 
           
 res
 .cookie('token', token, {
                httpOnly:true,
                secure: false,
                
            })
            .send({success: true});
            ) 

// important settings cors use er moddhe  cors setup origin and credentials: true example bellow 
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials:true
}));


than===>>
 
  4. from client side: axios {withCredentials true}

  

*/ 