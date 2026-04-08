import { Mail, Phone, MapPin } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };
    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                <div className="col-span-1  py-10">
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" style={{ background: accentColor + '70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}
                </div>

                {/* Name + Title */}
                <div className="col-span-2 flex flex-col justify-center py-10 px-8">
                    <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
                        {data?.personal_info?.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">


                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                            CONTACT
                        </h2>
                        <div className="space-y-2 text-sm">
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                        </div>
                    </section>

                </aside>

                {/* Right Content */}
                <main className="col-span-2 p-8 pt-0">

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className="mb-8">
                            <h2 className="text-sm font-semibold tracking-widest mb-3" style={{ color: accentColor }} >
                                SUMMARY
                            </h2>
                            <p className="text-zinc-700 leading-relaxed">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {(data.section_order || ['experience', 'education', 'project', 'skills', 'languages', 'custom_sections']).map((sectionKey) => {
                        if (sectionKey === 'experience' && data.experience?.length) {
                            return (
                                <section key={sectionKey} className="mb-8">
                                    <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }}>EXPERIENCE</h2>
                                    <div className="space-y-6">
                                        {data.experience.map((exp, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-zinc-900">{exp.position}</h3>
                                                    <span className="text-xs text-zinc-500">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                                </div>
                                                <p className="text-sm mb-2" style={{ color: accentColor }}>{exp.company}</p>
                                                {exp.description && <ul className="list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1">{exp.description.split("\n").map((line, i) => <li key={i}>{line}</li>)}</ul>}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )
                        }
                        if (sectionKey === 'education' && data.education?.length) {
                            return (
                                <section key={sectionKey} className="mb-8">
                                    <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>EDUCATION</h2>
                                    <div className="space-y-3 mt-3">
                                        {data.education.map((edu, index) => (
                                            <div key={index} className="text-sm">
                                                <p className="font-semibold uppercase">{edu.degree}</p>
                                                <p className="text-zinc-700">{edu.institution}</p>
                                                <p className="text-xs text-zinc-500">{formatDate(edu.graduation_date)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )
                        }
                        if (sectionKey === 'project' && data.project?.length) {
                            return (
                                <section key={sectionKey} className="mb-8">
                                    <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>PROJECTS</h2>
                                    <div className="space-y-4 mt-3">
                                        {data.project.map((project, index) => (
                                            <div key={index}>
                                                <h3 className="text-md font-medium text-zinc-800">{project.title || project.name}</h3>
                                                {project.description && <p className="text-sm text-zinc-700 mt-1">{project.description}</p>}
                                                <div className="flex flex-wrap gap-4 mt-2 text-xs">
                                                    {project.live_url && <a className="underline text-zinc-700 break-all" href={project.live_url} target="_blank" rel="noreferrer">Live URL</a>}
                                                    {project.github_repo && <a className="underline text-zinc-700 break-all" href={project.github_repo} target="_blank" rel="noreferrer">GitHub Repo</a>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )
                        }
                        if (sectionKey === 'skills' && data.skills?.length) {
                            return (
                                <section key={sectionKey} className="mb-8">
                                    <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>SKILLS</h2>
                                    <ul className="space-y-1 text-sm mt-3">{data.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
                                </section>
                            )
                        }
                        if (sectionKey === 'languages' && data.languages?.length) {
                            return (
                                <section key={sectionKey} className="mb-8">
                                    <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>LANGUAGES</h2>
                                    <ul className="space-y-1 text-sm mt-3">{data.languages.map((language, index) => <li key={index}>{language.name}{language.proficiency ? ` (${language.proficiency})` : ''}</li>)}</ul>
                                </section>
                            )
                        }
                        if (sectionKey === 'custom_sections' && data.custom_sections?.length) {
                            return data.custom_sections.map((section, sectionIndex) => (
                                <section key={`${sectionKey}-${sectionIndex}`} className="mb-8">
                                    <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>{section.title || 'OTHER'}</h2>
                                    <ul className="list-disc list-inside text-sm text-zinc-700 mt-3 space-y-1">
                                        {(section.items || []).filter(Boolean).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                                    </ul>
                                </section>
                            ))
                        }
                        return null
                    })}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;