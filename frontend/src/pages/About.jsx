import React, { useState } from 'react'
import Title from '../components/Title';

const teamMembers = [
  { id: 1, name: "Linda", role: "lineln-2@student.ltu.se", image: null},
  { id: 2, name: "Herman", role: "hergha@student.ltu.se", image: null},
  { id: 3, name: "Simon", role: "simtes-3@student.ltu.se", image: null },
];

const About = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className='flex flex-col gap-16 py-16' style={{ color: '#6f1811' }}>

      {/* TITLE */}
      <div className='flex flex-col items-center'>
        <Title text1={"READ ALL ABOUT"} text2={"US"} />
      </div>

      {/* PROJECT GOAL SECTION */}
      <div className='flex flex-col sm:flex-row gap-10 items-start'>
        <div className='flex-1 border-l-4 pl-6' style={{ borderColor: '#6f1811' }}>
          <p className='text-[10px] uppercase tracking-widest opacity-50 mb-2'>Project</p>
          <h2 className='text-2xl font-bold uppercase tracking-tight mb-4'>D0018E</h2>
          <p className='text-sm leading-relaxed opacity-80'>
            A project to create an e-commerce website course, D0018E, built on a relational database.
          </p>
        </div>
        <div className='flex-1 border-l-4 pl-6' style={{ borderColor: '#6f1811' }}>
          <p className='text-[10px] uppercase tracking-widest opacity-50 mb-2'>Our Mission</p>
          <h2 className='text-2xl font-bold uppercase tracking-tight mb-4'>Meet 4 Meat</h2>
          <p className='text-sm leading-relaxed opacity-80'>
            Meet 4 Meat is a fictional e-commerce website specializing in high-quality meat products. We are committed to delivering exceptional customer service and ensuring that every order meets the highest standards of quality and freshness.
          </p>
        </div>
      </div>

      {/* MEET THE TEAM */}
      <div>
        <div className='flex flex-col items-center mb-10'>
          <Title text1={"MEET"} text2={"THE TEAM"} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {teamMembers.map(member => (
            <div
              key={member.id}
              onClick={() => setSelected(selected?.id === member.id ? null : member)}
              className='cursor-pointer border flex flex-col items-center p-6 gap-4 hover:shadow-md transition-all'
              style={{ borderColor: '#6f1811' }}>

              {/* PHOTO */}
              <div className='w-28 h-28 overflow-hidden border-2' style={{ borderColor: '#6f1811' }}>
                {member.image ? (
                  <img src={member.image} alt={member.name} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-2xl font-bold opacity-20'
                    style={{ backgroundColor: 'rgba(111,24,17,0.05)' }}>
                    {member.name[0]}
                  </div>
                )}
              </div>

              <div className='text-center'>
                <p className='font-bold uppercase tracking-widest text-sm'>{member.name}</p>
                <p className='text-[10px] uppercase tracking-widest opacity-50 mt-1'>{member.role}</p>
              </div>

              <p className='text-[10px] uppercase tracking-widest opacity-40'>
                {selected?.id === member.id ? "Click to close" : "Click to view"}
              </p>
            </div>
          ))}
        </div>

        {/* EXPANDED MEMBER CARD */}
        {selected && (
          <div className='mt-8 border p-8 flex flex-col sm:flex-row gap-8 items-start'
            style={{ borderColor: '#6f1811' }}>

            {/* PHOTO */}
            <div className='w-32 h-32 overflow-hidden border-2 flex-shrink-0' style={{ borderColor: '#6f1811' }}>
              {selected.image ? (
                <img src={selected.image} alt={selected.name} className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-4xl font-bold opacity-20'
                  style={{ backgroundColor: 'rgba(111,24,17,0.05)' }}>
                  {selected.name[0]}
                </div>
              )}
            </div>

            {/* INFO */}
            <div className='flex flex-col gap-3'>
              <div>
                <p className='text-[10px] uppercase tracking-widest opacity-50'>Team Member</p>
                <h3 className='text-2xl font-bold uppercase tracking-tight'>{selected.name}</h3>
                <p className='text-xs uppercase tracking-widest opacity-50 mt-1'>{selected.role}</p>
              </div>
              <div className='w-12 border-t' style={{ borderColor: '#6f1811' }}></div>
              <p className='text-sm leading-relaxed opacity-80'>{selected.bio}</p>
            </div>

            {/* CLOSE */}
            <button onClick={() => setSelected(null)}
              className='ml-auto text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-all self-start'>
              ✕ Close
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default About;