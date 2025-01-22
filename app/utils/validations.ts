export function validateEmail(email: string) {
	if (!email || typeof email !== "string") {
	  return "Email is required";
	}

	if (!email.includes("@")) {
	  return "Invalid email address";
	}

	return null;
  }

  export function validatePassword(password: string) {
	if (!password || typeof password !== "string") {
	  return "Password is required";
	}

	if (password.length < 8) {
	  return "Password must be at least 8 characters";
	}

	if (!/[A-Z]/.test(password)) {
	  return "Password must contain at least one uppercase letter";
	}

	if (!/[a-z]/.test(password)) {
	  return "Password must contain at least one lowercase letter";
	}

	if (!/[0-9]/.test(password)) {
	  return "Password must contain at least one number";
	}

	return null;
  }