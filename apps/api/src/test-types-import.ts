// Test file to verify @insyd/types import works
import type { DomainEvent, User, Notification } from '@insyd/types';

console.log('✅ @insyd/types import successful');

export const testTypesImport = (): boolean => {
  // This will only compile if types are properly resolved
  const testEvent: DomainEvent = {
    id: 'test',
    type: 'POST_CREATED',
    actorId: 'user1',
    entityId: 'post1',
    timestamp: new Date()
  };
  
  return testEvent.type === 'POST_CREATED';
};