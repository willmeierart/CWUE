const BlogPost = ({ content }) => (
  <div className='outer-container'>
    <div className='inner-container'>
      <h1>Some Blog Post</h1>
      <div className='date'>04/12/2018</div>
      <div className='img-wrapper'>
        {/* <img alt='blog-pic' /> */}
        <div className='img-standin'>img</div>
      </div>
      <div className='body'>Yr pickled pop-up, microdosing chillwave plaid iceland retro art party cred waistcoat food truck. Austin live-edge ethical, ramps brunch selvage pinterest everyday carry pok pok succulents artisan leggings banjo lomo. Sriracha listicle raw denim, distillery kinfolk chia taiyaki gastropub vape twee hella cred literally. Butcher shabby chic echo park taxidermy, actually selvage chillwave chia bespoke woke small batch twee pickled. Scenester tumblr pabst post-ironic, kickstarter adaptogen gastropub retro prism. Gochujang drinking vinegar before they sold out kickstarter.
        \n \n
        Tote bag gastropub stumptown, food truck twee edison bulb brooklyn four dollar toast. Tumeric cliche artisan, ennui tofu four loko health goth celiac blog echo park intelligentsia chia biodiesel vinyl. Semiotics godard thundercats bicycle rights pop-up tousled microdosing gentrify try-hard portland vegan seitan pork belly gochujang 8-bit.
        \n \n
        Locavore chartreuse migas messenger bag DIY freegan. Gastropub banh mi gochujang poke butcher, normcore mlkshk hexagon XOXO. Distillery tofu af, chia umami letterpress ramps unicorn poutine swag craft beer neutra la croix kogi cliche. Mustache before they sold out meh la croix, organic fam selvage shoreditch pickled echo park succulents deep v butcher.</div>
    </div>
    <style jsx>{`
      .outer-container {
        margin-bottom: 50px;
        border: 1px solid black;
        border-radius: 5px;
        padding: 10px;
      }
      h1 {
        margin-bottom: 0;
      }
      .date {
        font-size: .9em;
        font-style: italic;
      }
      .img-standin {
        border: 1px solid black;
        border-radius: 5px;
        background: lightgrey;
        width: 50px;
        height: 50px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1em 0;
      }
    `}</style>
  </div>
)

export default BlogPost
