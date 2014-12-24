/**
    Copyright 2014 Goran Antic

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Serialization;

namespace WebApp
{
    /*public class ColorMap {
        float val;
        string color;
    }*/

    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static string GetPageInitData()
        {
            string result;
            using (web_femEntities entities = new web_femEntities())
            {
                var models = from model in entities.ModelGeometries
                             select new
                             {
                                 id = model.Id,
                                 name = model.Name,
                                 contours = from contour in model.ModelContours
                                            select new { id = contour.Id, name = contour.Name }
                             };
                var colorMaps = from cm in entities.ColorMaps
                                select new
                                {
                                    id = cm.Id,
                                    name = cm.Name,
                                    data = cm.Data
                                };

                var serializer = new JavaScriptSerializer();
                result = serializer.Serialize(new { models, colorMaps });
            }
            return result;
        }

        protected override PageStatePersister PageStatePersister
        {
            get
            {
                //return base.PageStatePersister;
                return new SessionPageStatePersister(this);
            }
        }
    }
}