const jwt = require('jsonwebtoken');
const { ExamSession, Assessment } = require('../models'); // Ensure models are properly defined
const { Op } = require('sequelize');
require('dotenv').config();

/**
 * Start a new exam session
 */


// exports.startSession = async (req, res) => {
//   try {
//     console.log('Request received to start session');
//     const { assessment_id } = req.body;

//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.STUDENT_JWT_SECRET);
//     const user_id = decoded.id;

//     console.log('Decoded JWT:', decoded);

//     const assessment = await Assessment.findOne({
//       where: {
//         id: assessment_id,
//         is_active: true,
//         start_window: { [Op.lte]: new Date() },
//         end_window: { [Op.gte]: new Date() },
//       },
//     });

//     if (!assessment) {
//       return res.status(404).json({ message: 'Assessment not found or inactive' });
//     }

//     const existingSession = await ExamSession.findOne({
//       where: {
//         assessment_id,
//         user_id,
//         status: { [Op.or]: ['active', 'paused'] },
//       },
//     });

//     if (existingSession) {
//       return res.status(400).json({
//         message: 'You already have an active or paused session for this assessment',
//         session: existingSession,
//       });
//     }

//     const start_time = new Date();
//     const end_time = new Date(start_time.getTime() + assessment.duration_minutes * 60 * 1000);
//     const remaining_time = assessment.duration_minutes * 60;

//     const newSession = await ExamSession.create({
//       assessment_id,
//       user_id,
//       start_time,
//       end_time,
//       remaining_time,
//       status: 'active',
//     });

//     res.status(201).json({
//       message: 'Exam session started successfully',
//       session_id: newSession.id,
//       start_time,
//       end_time,
//       remaining_time,
//     });
//   } catch (error) {
//     console.error('Error starting session:', error);
//     res.status(500).json({ message: 'Failed to start exam session', error });
//   }
// };




// exports.startSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.body;
//     const user_id = req.user.id;

//     if (!assessment_id) {
//       return res.status(400).json({ message: 'assessment_id is required' });
//     }

//     console.log('Starting session for assessment:', assessment_id, 'and user:', user_id);

//     const assessment = await Assessment.findOne({
//       where: {
//         id: assessment_id,
//         is_active: true,
//         start_window: { [Op.lte]: new Date() },
//         end_window: { [Op.gte]: new Date() },
//       },
//     });

//     if (!assessment) {
//       console.log('Assessment not found or inactive for assessment_id:', assessment_id);
//       return res.status(404).json({ message: 'Assessment not found or inactive' });
//     }

//     const existingSession = await ExamSession.findOne({
//       where: { assessment_id, user_id, status: { [Op.or]: ['active', 'paused'] } },
//     });

//     if (existingSession) {
//       return res.status(400).json({
//         message: 'Active or paused session already exists for this assessment',
//         session: existingSession,
//       });
//     }

//     const start_time = new Date();
//     const end_time = new Date(start_time.getTime() + assessment.duration_minutes * 60 * 1000);

//     const newSession = await ExamSession.create({
//       assessment_id,
//       user_id,
//       start_time,
//       end_time,
//       remaining_time: assessment.duration_minutes * 60,
//       status: 'active',
//     });

//     console.log('New session created successfully:', newSession);
//     res.status(201).json({ session_id: newSession.id, end_time });
//   } catch (error) {
//     console.error('Error starting session:', error);
//     res.status(500).json({ message: 'Failed to start session', error });
//   }
// };


// exports.startSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.body;
//     const user_id = req.user.id;

//     if (!assessment_id) {
//       return res.status(400).json({ message: 'assessment_id is required' });
//     }

//     console.log('Starting session for assessment:', assessment_id, 'and user:', user_id);

//     // Check if assessment is valid
//     const assessment = await Assessment.findOne({
//       where: {
//         id: assessment_id,
//         is_active: true,
//         start_window: { [Op.lte]: new Date() },
//         end_window: { [Op.gte]: new Date() },
//       },
//     });

//     if (!assessment) {
//       return res.status(404).json({ message: 'Assessment not found or inactive' });
//     }

//     // Check for existing active or paused session
//     const existingSession = await ExamSession.findOne({
//       where: { assessment_id, user_id, status: { [Op.or]: ['active', 'paused'] } },
//     });

//     if (existingSession) {
//       return res.status(200).json({
//         message: 'Active or paused session already exists',
//         session: existingSession,
//       });
//     }

//     // Create a new session
//     const start_time = new Date();
//     const end_time = new Date(start_time.getTime() + assessment.duration_minutes * 60 * 1000);
//     const newSession = await ExamSession.create({
//       assessment_id,
//       user_id,
//       start_time,
//       end_time,
//       remaining_time: assessment.duration_minutes * 60,
//       status: 'active',
//     });

//     res.status(201).json({
//       message: 'New session created successfully',
//       session_id: newSession.id,
//       end_time: newSession.end_time,
//     });
//   } catch (error) {
//     console.error('Error starting session:', error);
//     res.status(500).json({ message: 'Failed to start session', error });
//   }
// };


// exports.startSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.body;
//     const user_id = req.user.id;

//     if (!assessment_id) {
//       return res.status(400).json({ message: 'Assessment ID is required' });
//     }

//     // Check if a session exists
//     const existingSession = await ExamSession.findOne({
//       where: {
//         assessment_id,
//         user_id,
//         status: { [Op.in]: ['active', 'paused', 'ended'] }, // Check for existing sessions including ended
//       },
//     });

//     if (existingSession) {
//       if (existingSession.status === 'ended') {
//         return res.status(400).json({
//           message: 'This exam session has already been ended and cannot be restarted.',
//         });
//       }

//       return res.status(200).json({
//         message: 'Active or paused session already exists',
//         session: existingSession,
//       });
//     }

//     // Start a new session
//     const assessment = await Assessment.findOne({
//       where: {
//         id: assessment_id,
//         is_active: true,
//         start_window: { [Op.lte]: new Date() },
//         end_window: { [Op.gte]: new Date() },
//       },
//     });

//     if (!assessment) {
//       return res.status(404).json({ message: 'Assessment not found or not available' });
//     }

//     const startTime = new Date();
//     const endTime = new Date(startTime.getTime() + assessment.duration_minutes * 60 * 1000);

//     const newSession = await ExamSession.create({
//       assessment_id,
//       user_id,
//       start_time: startTime,
//       end_time: endTime,
//       remaining_time: assessment.duration_minutes * 60,
//       status: 'active',
//     });

//     res.status(201).json({
//       message: 'New session created successfully',
//       session_id: newSession.id,
//       end_time: newSession.end_time,
//     });
//   } catch (error) {
//     console.error('Error starting session:', error);
//     res.status(500).json({ message: 'Failed to start session', error });
//   }
// };


exports.startSession = async (req, res) => {
  try {
    const { assessment_id } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!assessment_id) {
      return res.status(400).json({ message: "Assessment ID is required." });
    }

    // Check if the assessment exists and is not ended
    const assessment = await Assessment.findOne({ where: { id: assessment_id, is_active: true } });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found or inactive." });
    }

    const existingSession = await ExamSession.findOne({
      where: {
        assessment_id,
        user_id,
        status: { [Op.in]: ["active", "paused"] },
      },
    });

    // If an "ended" session exists
    const endedSession = await ExamSession.findOne({
      where: {
        assessment_id,
        user_id,
        status: "ended",
      },
    });

    if (endedSession) {
      return res.status(400).json({
        message: "This assessment has already been ended by you.",
        session: endedSession,
      });
    }

    if (existingSession) {
      return res.status(400).json({
        message: "Active or paused session already exists.",
        session: existingSession,
      });
    }

    // Create a new session
    const durationSeconds = assessment.duration_minutes * 60;
    const endTime = new Date(Date.now() + durationSeconds * 1000);

    const newSession = await ExamSession.create({
      assessment_id,
      user_id,
      start_time: new Date(),
      end_time: endTime,
      remaining_time: durationSeconds,
      status: "active",
    });

    return res.status(201).json({
      message: "New session created successfully.",
      session_id: newSession.id,
      end_time: newSession.end_time,
    });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ message: "Failed to start session", error });
  }
};









/**
 * Pause an active exam session
 */
exports.pauseSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await ExamSession.findOne({
      where: { id: session_id, status: 'active' },
    });

    if (!session) {
      return res.status(404).json({ message: 'Active session not found' });
    }

    const now = new Date();
    const remaining_time = Math.max(
      0,
      Math.floor((new Date(session.end_time) - now) / 1000)
    );

    await session.update({
      remaining_time,
      status: 'paused',
    });

    res.status(200).json({ message: 'Session paused successfully', remaining_time });
  } catch (error) {
    console.error('Error pausing session:', error);
    res.status(500).json({ message: 'Failed to pause session', error });
  }
};

/**
 * Resume a paused exam session
 */
exports.resumeSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await ExamSession.findOne({
      where: { id: session_id, status: 'paused' },
    });

    if (!session) {
      return res.status(404).json({ message: 'Paused session not found' });
    }

    const start_time = new Date();
    const end_time = new Date(start_time.getTime() + session.remaining_time * 1000);

    await session.update({
      start_time,
      end_time,
      status: 'active',
    });

    res.status(200).json({
      message: 'Session resumed successfully',
      start_time,
      end_time,
      remaining_time: session.remaining_time,
    });
  } catch (error) {
    console.error('Error resuming session:', error);
    res.status(500).json({ message: 'Failed to resume session', error });
  }
};

/**
 * Mark an exam session as completed
 */
exports.completeSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await ExamSession.findOne({
      where: { id: session_id, status: 'active' },
    });

    if (!session) {
      return res.status(404).json({ message: 'Active session not found' });
    }

    await session.update({ status: 'completed' });

    res.status(200).json({ message: 'Session marked as completed' });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ message: 'Failed to complete session', error });
  }
};

/**
 * Expire sessions where the end time has passed
 */
exports.expireSessions = async (req, res) => {
  try {
    const now = new Date();
    const expiredSessions = await ExamSession.update(
      { status: 'expired' },
      { where: { end_time: { [Op.lt]: now }, status: 'active' } }
    );

    res.status(200).json({
      message: 'Expired sessions updated successfully',
      affectedRows: expiredSessions[0],
    });
  } catch (error) {
    console.error('Error expiring sessions:', error);
    res.status(500).json({ message: 'Failed to expire sessions', error });
  }
};

// Get the current active session for a user and assessment
// exports.getActiveSession = async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.STUDENT_JWT_SECRET);
//     const user_id = decoded.id;
//     const { assessment_id } = req.query;

//     // Check for an active session
//     const session = await ExamSession.findOne({
//       where: {
//         user_id,
//         assessment_id,
//         status: { [Op.or]: ['active', 'paused'] },
//       },
//     });

//     if (!session) {
//       return res.status(404).json({ message: 'No active session found' });
//     }

//     res.status(200).json({ message: 'Active session found', session });
//   } catch (error) {
//     console.error('Error fetching active session:', error);
//     res.status(500).json({ message: 'Failed to fetch active session', error });
//   }
// };



// exports.getActiveSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.query; // Extract assessment_id from query params
//     const user_id = req.user.id; // Get the user_id from JWT (middleware handles this)

//     // Fetch the active or paused session for this user and assessment
//     const session = await ExamSession.findOne({
//       where: {
//         assessment_id,
//         user_id,
//         status: { [Op.or]: ['active', 'paused'] }, // Only active or paused sessions
//       },
//     });

//     if (!session) {
//       return res.status(404).json({ message: 'No active session found' });
//     }

//     // If session is found, dynamically calculate remaining time
//     const now = new Date();
//     let remaining_time_in_seconds = session.remaining_time; // Default to remaining_time stored in DB

//     if (session.status === 'active') {
//       const timeElapsed = Math.floor((now - new Date(session.start_time)) / 1000); // Time passed since start
//       remaining_time_in_seconds = Math.max(session.remaining_time - timeElapsed, 0); // Reduce remaining time
//     }

//     // Respond with session details and calculated remaining time
//     res.status(200).json({
//       message: 'Active session fetched successfully',
//       session: {
//         ...session.toJSON(),
//         remaining_time: remaining_time_in_seconds, // Return updated remaining time
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching active session:', error);
//     res.status(500).json({ message: 'Error fetching active session', error });
//   }
// };



// exports.getActiveSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.query; // Extract assessment_id from query params
//     const user_id = req.user.id; // Get the user_id from JWT (middleware handles this)

//     // Fetch the active or paused session for this user and assessment
//     const session = await ExamSession.findOne({
//       where: {
//         assessment_id,
//         user_id,
//         status: { [Op.or]: ['active', 'paused'] }, // Only active or paused sessions
//       },
//     });

//     if (!session) {
//       return res.status(404).json({ message: 'No active session found' });
//     }

//     // Return the session details and the stored remaining time
//     res.status(200).json({
//       message: 'Active session fetched successfully',
//       session: {
//         ...session.toJSON(),
//         remaining_time: session.remaining_time, // Always return the stored remaining time
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching active session:', error);
//     res.status(500).json({ message: 'Error fetching active session', error });
//   }
// };



// exports.getActiveSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.query; // Extract assessment_id from query params
//     const user_id = req.user.id; // Get user_id from JWT (middleware handles this)

//     // Fetch the active or paused session for this user and assessment
//     const session = await ExamSession.findOne({
//       where: {
//         assessment_id,
//         user_id,
//         status: { [Op.or]: ['active', 'paused'] }, // Fetch both active and paused sessions
//       },
//     });

//     if (!session) {
//       return res.status(404).json({ message: 'No active session found' });
//     }

//     // If the session is active, dynamically calculate the remaining time
//     const now = new Date();
//     let remaining_time_in_seconds = session.remaining_time;

//     if (session.status === 'active') {
//       const timeElapsed = Math.floor((now - new Date(session.start_time)) / 1000); // Time passed since start
//       remaining_time_in_seconds = Math.max(session.remaining_time - timeElapsed, 0);
//     }

//     // If the session is paused, just return the stored remaining_time without calculation

//     res.status(200).json({
//       message: 'Active session fetched successfully',
//       session: {
//         ...session.toJSON(),
//         remaining_time: remaining_time_in_seconds, // Dynamically calculated or fetched
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching active session:', error);
//     res.status(500).json({ message: 'Error fetching active session', error });
//   }
// };




// exports.getActiveSession = async (req, res) => {
//   try {
//     const { assessment_id } = req.query;
//     const user_id = req.user.id;

//     const activeSession = await ExamSession.findOne({
//       where: {
//         assessment_id,
//         user_id,
//         status: { [Op.or]: ['active', 'paused'] },
//       },
//     });

//     if (!activeSession) {
//       return res.status(404).json({ message: 'No active session found' });
//     }

//     res.status(200).json({
//       message: 'Active session retrieved successfully',
//       session: activeSession,
//     });
//   } catch (error) {
//     console.error('Error retrieving active session:', error);
//     res.status(500).json({ message: 'Failed to retrieve active session', error });
//   }
// };
exports.getActiveSession = async (req, res) => {
  try {
    const { assessment_id } = req.query;
    const user_id = req.user.id;

    if (!assessment_id) {
      return res.status(400).json({ message: 'assessment_id is required' });
    }

    console.log('Fetching active session for assessment:', assessment_id, 'and user:', user_id);

    const session = await ExamSession.findOne({
      where: { assessment_id, user_id, status: { [Op.or]: ['active', 'paused'] } },
    });

    if (!session) {
      return res.status(404).json({ message: 'No active or paused session found' });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error('Error fetching active session:', error);
    res.status(500).json({ message: 'Error fetching active session', error });
  }
};




exports.updateRemainingTime = async (req, res) => {
  try {
    const { session_id, remaining_time } = req.body;

    // Validate inputs
    if (!session_id || remaining_time === undefined) {
      return res.status(400).json({ message: 'Session ID and remaining time are required' });
    }

    // Update the session in the database
    const updatedSession = await ExamSession.update(
      { remaining_time },
      { where: { id: session_id, status: 'active' } }
    );

    if (updatedSession[0] === 0) {
      return res.status(404).json({ message: 'Active session not found' });
    }

    res.status(200).json({ message: 'Remaining time updated successfully' });
  } catch (error) {
    console.error('Error updating remaining time:', error);
    res.status(500).json({ message: 'Failed to update remaining time', error });
  }
};






// End an exam session
exports.endSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Find and update the session
    const updatedSession = await ExamSession.update(
      { status: 'ended', remaining_time: 0 }, // Set the status to ended and reset remaining time
      { where: { id: session_id, status: 'active' } } // Only end active sessions
    );

    if (updatedSession[0] === 0) {
      return res.status(404).json({ message: 'Active session not found or already ended' });
    }

    res.status(200).json({ message: 'Exam session ended successfully' });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ message: 'Failed to end session', error });
  }
};








