import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
export default function ResumePreview({ data, template, accentColor, classes }) {


    const renderTemplate = () => {
        switch (template) {
            case 'classic':
                return <ClassicTemplate data={data} accentColor={accentColor} />
            case 'modern':
                return <ModernTemplate data={data} accentColor={accentColor} />
            case 'minimal-image':
                return <MinimalImageTemplate data={data} accentColor={accentColor} />
            case 'minimal':
                return <MinimalTemplate data={data} accentColor={accentColor} />
            default:
                return <ClassicTemplate data={data} accentColor={accentColor} />
        }
    }
    return (
        <div className='w-full bg-gray-50'>
            <div id='resume-preview' className={'border border-gray-200 print:shadow-none print:border-none' + classes}>
                {renderTemplate()}
            </div>

            <style>{`
        @page{
            size:letter;
            margin:0;
        }
        @media print {
                html, body {
                width: 8.5in;
                height: 11in;
                overflow: hidden;
                }
                body * {
                visibility: hidden;
                }
                #resume-preview, #resume-preview * {
                    visibility: visible;
                }
                #resume-preview {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: auto;
                    box-shadow: none;
                    border: none;
                    margin: 0;
                    padding: 0;
                }
          }
        `}</style>
        </div>
    )
}
