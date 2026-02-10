
import { useQuery } from '@tanstack/react-query';
import agent from '../api/agent';
import type { Member } from '../types';


export const useMembers = () => {

 
  const { data: members, isPending } = useQuery<Member[], Error>({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await agent.Members.list();
      return response;
    }
  });

  return { members , isPending}
}
