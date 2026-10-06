import Link from 'next/link';

export const metadata = { title: 'Politica de Privacidad - iSolar' };

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-montserrat font-bold">iSolar</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-montserrat font-bold text-navy mb-6">Politica de Tratamiento de Datos Personales</h1>
        <div className="bg-white rounded-xl p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
          <p><strong>Responsable:</strong> iSolar / RedNode Technology S.A.S., identificada con NIT [pendiente], con domicilio en Rionegro, Antioquia, Colombia.</p>

          <h2 className="text-lg font-semibold text-navy pt-2">1. Marco legal</h2>
          <p>La presente politica se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 y demas normas concordantes sobre proteccion de datos personales en Colombia.</p>

          <h2 className="text-lg font-semibold text-navy pt-2">2. Datos recopilados</h2>
          <p>Recopilamos los siguientes datos personales: nombre completo, numero de cedula, correo electronico, numero de telefono, ciudad y direccion de envio.</p>

          <h2 className="text-lg font-semibold text-navy pt-2">3. Finalidad del tratamiento</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Procesar y gestionar pedidos de productos</li>
            <li>Enviar informacion sobre el estado de los pedidos</li>
            <li>Gestionar la facturacion y pagos</li>
            <li>Coordinar la entrega de productos</li>
            <li>Atender solicitudes, quejas y reclamos</li>
          </ul>

          <h2 className="text-lg font-semibold text-navy pt-2">4. Derechos del titular</h2>
          <p>De acuerdo con la Ley 1581 de 2012, usted tiene derecho a:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Conocer, actualizar y rectificar sus datos personales</li>
            <li>Solicitar prueba de la autorizacion otorgada</li>
            <li>Ser informado sobre el uso de sus datos</li>
            <li>Revocar la autorizacion y/o solicitar la supresion de los datos</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC)</li>
          </ul>

          <h2 className="text-lg font-semibold text-navy pt-2">5. Seguridad</h2>
          <p>Implementamos medidas tecnicas y organizativas para proteger los datos personales contra acceso no autorizado, perdida o alteracion. Los pagos son procesados por Wompi, un procesador de pagos certificado, y no almacenamos datos de tarjetas de credito.</p>

          <h2 className="text-lg font-semibold text-navy pt-2">6. Transferencia de datos</h2>
          <p>Los datos personales no seran vendidos, alquilados ni compartidos con terceros, salvo lo necesario para procesar pagos (Wompi) y realizar envios.</p>

          <h2 className="text-lg font-semibold text-navy pt-2">7. Vigencia</h2>
          <p>Los datos personales seran conservados mientras sea necesario para las finalidades descritas o mientras exista una relacion comercial vigente, y seran eliminados cuando el titular lo solicite.</p>

          <h2 className="text-lg font-semibold text-navy pt-2">8. Contacto</h2>
          <p>Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos, puede comunicarse a: <strong>info@isolar.rednodetech.com</strong></p>

          <p className="text-xs text-gray-400 pt-4">Ultima actualizacion: octubre 2026</p>
        </div>
      </main>
    </div>
  );
}
