const jwt = require('jsonwebtoken');

// Middleware to verify admin tokens
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const actualToken = token.split(' ')[1];

  // Verify using ADMIN secret
  jwt.verify(actualToken, process.env.ADMIN_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    req.user = decoded; // Attach decoded token info to request
    next();
  });
};

// Middleware to verify trainer tokens
const verifyTrainer = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const actualToken = token.split(' ')[1];

  // Verify using TRAINER secret
  jwt.verify(actualToken, process.env.TRAINER_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    if (decoded.role !== 'trainer') {
      return res.status(403).json({ message: 'Trainer access only' });
    }

    req.user = decoded;
    next();
  });
};

// Similarly, add middleware for College and Student roles

const verifyCollege = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const actualToken = token.split(' ')[1];

  jwt.verify(actualToken, process.env.COLLEGE_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    if (decoded.role !== 'college') {
      return res.status(403).json({ message: 'College access only' });
    }

    req.user = decoded;
    next();
  });
};

// const verifyStudent = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(403).json({ message: 'Token is required' });
//   }

//   const actualToken = token.split(' ')[1];

//   jwt.verify(actualToken, process.env.STUDENT_JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Token verification failed' });
//     }

//     if (decoded.role !== 'student') {
//       return res.status(403).json({ message: 'Student access only' });
//     }

//     req.user = decoded;
//     next();
//   });
// };


// Middleware to verify student tokens


// const verifyStudent = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(403).json({ message: 'Token is required' });
//   }

//   const actualToken = token.split(' ')[1];

//   // Verify using STUDENT secret
//   jwt.verify(actualToken, process.env.STUDENT_JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Token verification failed' });
//     }

//     if (decoded.role !== 'student') {
//       return res.status(403).json({ message: 'Student access only' });
//     }

//     req.user = decoded;  // This should include batch_id in the token payload
//     next();
//   });
// };


// const verifyStudent = (req, res, next) => {
//   console.log('Authorization Header:', req.headers['authorization']);
  
//   const token = req.headers['authorization'];
//   if (!token) {
//     console.error('No token provided');
//     return res.status(403).json({ message: 'Token is required' });
//   }

//   const actualToken = token.split(' ')[1];
//   console.log('Extracted Token:', actualToken);

//   jwt.verify(actualToken, process.env.STUDENT_JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.error('JWT Verification Failed:', err);
//       return res.status(401).json({ message: 'Token verification failed' });
//     }

//     console.log('Decoded JWT:', decoded);

//     if (decoded.role !== 'student') {
//       console.error('Role is not student');
//       return res.status(403).json({ message: 'Student access only' });
//     }

//     req.user = decoded;
//     next();
//   });
// };



const verifyStudent = (req, res, next) => {
  console.log('Authorization Header:', req.headers['authorization']);

  const token = req.headers['authorization'];
  if (!token) {
    console.error('No token provided');
    return res.status(403).json({ message: 'Token is required' });
  }

  const actualToken = token.split(' ')[1];
  console.log('Extracted Token:', actualToken);

  jwt.verify(actualToken, process.env.STUDENT_JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ message: 'Token verification failed' });
    }

    console.log('Decoded JWT:', decoded);

    if (decoded.role !== 'student') {
      console.error('Unauthorized role:', decoded.role);
      return res.status(403).json({ message: 'Student access only' });
    }

    req.user = decoded;
    next();
  });
};





module.exports = {
  verifyAdmin,
  verifyTrainer,
  verifyCollege,
  verifyStudent,
};
