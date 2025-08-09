// /* 
//  What is the acceptable request rate
//  How granule do you want your API to be protected e.g IP address / User Account/Token
//  How long should penalties last

//  How would we know if that certain user is abusing our API -> What data structure? Array. This will cost a lot of memory
//  How will the blocking actually happen -> How to deny the next request? Blacklisted but how? A field in the database? A table of blocklisted person?
 

//  */

//  // 30 request per minute (So other users can use the API)
//  // Map and counter expiry eg user1 : {count: 4, expiresAt: someTime}

//  import express, {Request, Response, NextFunction} from 'express'

//    interface I_rateLimiter {
//    expiresAt: Date | null;
//    count: number;
//    }

//    const rateLimiterDictionary: Record<string, I_rateLimiter> = {};


//  const addApiRequest = (uniqueId: string, expiresAt: Date) => {
//    console.log({ expiresAt });
//    const inquirerDetails = rateLimiterDictionary[uniqueId]

//    console.log({ inquirerDetails });

//    if (!inquirerDetails) {
//       console.log("User undefined executing this block");
//       rateLimiterDictionary[uniqueId] = { count: 1, expiresAt: expiresAt }

//       console.log("New Details", rateLimiterDictionary[uniqueId]);
//       return 1;
//    } else {
//       const newCount = inquirerDetails.count + 1;
//       rateLimiterDictionary[uniqueId] = { count: newCount, expiresAt: expiresAt }
      
//       return newCount; 
//    }
//  }

//  const cleanUpDictionary = () => {
//    console.log("End of minute execution");

//    for (const key in rateLimiterDictionary) {
//       console.log(key);
//       const userDetails = rateLimiterDictionary[key];
//       const expiresAt = userDetails.expiresAt;

//       if (expiresAt == null) return;
//       const now = new Date();

//       if (now.getTime() > expiresAt.getTime()) {
//          console.log(`comparing ${now.getTime()} to ${expiresAt.getTime()}`);
//          rateLimiterDictionary[key] = { count: 0, expiresAt: null }
//       }
//    }
//  }

//  setInterval(cleanUpDictionary, 10_000);

//  const limiterDateSetter = () => {
//    const dateNow = new Date();
//    // const endOfMinute = new Date(dateNow.setMilliseconds(999));

//    dateNow.setMinutes(dateNow.getMinutes() + 1);
//    return dateNow;
//  }
//  const rateLimiterMiddleware = async(req: Request, res: Response, next: NextFunction) => {
//     try {
        
//     } catch (error) {
        
//     }
//  }

 
//  export const logInLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
//    console.log("Log in limiter gets called");
//    const ipAdd = req.ip;
   
//    console.log(ipAdd);
//    try {

//       if (!ipAdd) return;

//       const dateReset = limiterDateSetter();
//       const userCount = addApiRequest(ipAdd, dateReset);
//       console.log({ userCount });
      
//       if (userCount > 5) {
//          res.status(429).json({ message: "Dude you are requesting so much" });
//          console.log("This gets executed so return");
//          return;
//       } 

//       next();
//    } catch (error) {
//       next (error)
//    }
//  }