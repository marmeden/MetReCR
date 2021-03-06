/**
 * Register each api
 * import private server methods and server publications
 */

// users api
import '../../api/users/publications.js';
import '../../api/users/hooks.js';

// counters api (example)
import '../../api/counters/methods.js';
import '../../api/counters/publications.js';

// import another api
import '../../api/bookings/publications.js';
import '../../api/fleet/publications.js';
import '../../api/workers/publications.js';
import '../../api/tasks/publications.js';