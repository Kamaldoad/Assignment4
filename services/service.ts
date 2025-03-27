import { supabase } from '../lib/supabase';

const addUser = async (userId: string, firstName: string, lastName: string, email: string) => {
    await supabase.from('user_details').insert([{ uuid: userId, first_name: firstName, last_name: lastName, email }]);
  };
  const getUsers = async () => {
    const { data } = await supabase.from('user_details').select('*');
    return data;
  };
  const updateUser = async (userId: string, firstName: string, lastName: string) => {
    await supabase.from('user_details').update({ first_name: firstName, last_name: lastName }).eq('uuid', userId);
  };
  const deleteUser = async (userId: string) => {
    await supabase.from('user_details').delete().eq('uuid', userId);
  };
        