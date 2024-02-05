import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {

    console.log("api/users/login: req: \n",req)

    if(req.method === 'GET') {
    
        const {username, password} = req.query;
        const userdata={
            Uuid: "123456",
            Sort: 666,
            UpdateTime:"2018-01-01 00:00:00",
            CreateTime:'2018-01-01 00:00:00',
            Role:"USER",
            Username: username,
            Password: password,
            LastTime: '2018-01-01 00:00:00',

            SpaceUuid: "888",
            Status: "OK",
        }
        return res.status(200).json(userdata);
    }
    





}


