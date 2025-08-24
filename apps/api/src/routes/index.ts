import { Router } from 'express';
import { eventsRouter } from './events.js';
import { notificationsRouter } from './notifications.js';
import { usersRouter } from './users.js';
import { postsRouter } from './posts.js';
import { followsRouter } from './follows.js';
import { settingsRouter } from './settings.js';

export const apiRoutes = Router();

apiRoutes.use('/events', eventsRouter);
apiRoutes.use('/notifications', notificationsRouter);
apiRoutes.use('/users', usersRouter);
apiRoutes.use('/posts', postsRouter);
apiRoutes.use('/follow', followsRouter);
apiRoutes.use('/settings', settingsRouter);