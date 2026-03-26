import authRepository from './src/modules/auth/repositories/auth.repository.js';

async function test() {
  try {
    console.log("Testing getAllUsers...");
    const users = await authRepository.getAllUsers();
    console.log("Users found:", users.length);
    console.log("First user:", users[0]);
  } catch (error) {
    console.error("Test failed:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

test();
