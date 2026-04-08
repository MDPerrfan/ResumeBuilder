
const MinimalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">{data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.website && (
                        <span className="break-all">{data.personal_info.website}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}
            {(data.section_order || ['experience', 'education', 'project', 'skills', 'languages', 'custom_sections']).map((sectionKey) => {
                if (sectionKey === 'experience' && data.experience?.length) {
                    return (
                        <section className="mb-10" key={sectionKey}>
                            <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>Experience</h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-lg font-medium">{exp.position}</h3>
                                            <span className="text-sm text-gray-500">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{exp.company}</p>
                                        {exp.description && <div className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
                if (sectionKey === 'education' && data.education?.length) {
                    return (
                        <section className="mb-10" key={sectionKey}>
                            <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, index) => (
                                    <div key={index} className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                                            <p className="text-gray-600">{edu.institution}</p>
                                            {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                        </div>
                                        <span className="text-sm text-gray-500">{formatDate(edu.graduation_date)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
                if (sectionKey === 'project' && data.project?.length) {
                    return (
                        <section className="mb-10" key={sectionKey}>
                            <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>Projects</h2>
                            <div className="space-y-4">
                                {data.project.map((proj, index) => (
                                    <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                        <h3 className="text-lg font-medium ">{proj.title || proj.name}</h3>
                                        <p className="text-gray-600">{proj.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {proj.live_url && <a className="underline text-gray-700 break-all" href={proj.live_url} target="_blank" rel="noreferrer">Live URL</a>}
                                            {proj.github_repo && <a className="underline text-gray-700 break-all" href={proj.github_repo} target="_blank" rel="noreferrer">GitHub Repo</a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }
                if (sectionKey === 'skills' && data.skills?.length) {
                    return (
                        <section className="mb-10" key={sectionKey}>
                            <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>Skills</h2>
                            <div className="text-gray-700">{data.skills.join(" • ")}</div>
                        </section>
                    )
                }
                if (sectionKey === 'languages' && data.languages?.length) {
                    return (
                        <section className="mb-10" key={sectionKey}>
                            <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>Languages</h2>
                            <div className="text-gray-700">{data.languages.map((language) => `${language.name}${language.proficiency ? ` (${language.proficiency})` : ''}`).join(' • ')}</div>
                        </section>
                    )
                }
                if (sectionKey === 'custom_sections' && data.custom_sections?.length) {
                    return data.custom_sections.map((section, sectionIndex) => (
                        <section className="mb-10" key={`${sectionKey}-${sectionIndex}`}>
                            <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>{section.title || 'Other'}</h2>
                            <ul className="text-gray-700 list-disc pl-6 space-y-2">
                                {(section.items || []).filter(Boolean).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                            </ul>
                        </section>
                    ))
                }
                return null
            })}
        </div>
    );
}

export default MinimalTemplate;